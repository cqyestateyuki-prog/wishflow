/**
 * AI Service Layer / AI 服务层
 * Provides Claude API integration for wish classification, keyword extraction, and SVG generation
 * 提供 Claude API 集成，用于愿望分类、关键词提取和 SVG 生成
 */

import Anthropic from '@anthropic-ai/sdk';
import { WishDomain, WishMood } from './types';
import { logger } from '@/lib/logger';

// Classification result type
export type ClassificationResult = {
  domain: WishDomain;
  keywords: string[];
  mood: WishMood;
  title: string; // Auto-generated short title
};

// SVG generation result type
export type SVGGenerationResult = {
  svg: string;
  success: boolean;
  error?: string;
  sceneSpec?: WishSceneSpec;
  validationIssues?: string[];
};

export type WishSceneSpec = {
  subject: string;
  supportingElements: string[];
  composition: string;
  motionElements: string[];
  avoid: string[];
  style: string;
};

export type SVGValidationResult = {
  ok: boolean;
  svg?: string;
  issues: string[];
};

// Error type for AI operations
export class AIError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AIError';
  }
}

// Create Anthropic client (server-side only)
function createClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIError('ANTHROPIC_API_KEY is not set', 'MISSING_API_KEY');
  }
  return new Anthropic({ apiKey });
}

// Classification prompt template
const CLASSIFICATION_PROMPT = `你是一个愿望分析助手。请分析以下愿望描述，返回 JSON 格式的结果。

愿望描述：
{description}

请返回以下格式的 JSON（不要包含其他文字）：
{
  "domain": "从以下选项中选择最匹配的一个：家人、事业、钱、健康、创造、生活、爱",
  "keywords": ["提取2-3个核心意象词，用于生成可视化图像"],
  "mood": "从以下选项中选择情绪基调：温暖、激励、平静、期待、自由",
  "title": "用10-15个字概括这个愿望的简短标题"
}

注意：
- domain 必须是：家人、事业、钱、健康、创造、生活、爱 中的一个
- mood 必须是：温暖、激励、平静、期待、自由 中的一个
- keywords 应该是具体的、有画面感的词，便于生成可视化
- title 应该简洁有力，抓住愿望的核心`;

/**
 * Classify a wish description using Claude API
 * @param description - The wish description to classify
 * @returns Classification result with domain, keywords, mood, and title
 */
export async function classifyWish(description: string): Promise<ClassificationResult> {
  if (!description || description.trim().length < 5) {
    throw new AIError('Description is too short', 'INVALID_INPUT');
  }

  const client = createClient();
  const prompt = CLASSIFICATION_PROMPT.replace('{description}', description);

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new AIError('No text response from Claude', 'INVALID_RESPONSE');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new AIError('Could not parse JSON from response', 'PARSE_ERROR');
    }

    const result = JSON.parse(jsonMatch[0]) as ClassificationResult;

    // Validate domain
    const validDomains: WishDomain[] = ['家人', '事业', '钱', '健康', '创造', '生活', '爱'];
    if (!validDomains.includes(result.domain)) {
      result.domain = '生活'; // Default fallback
    }

    // Validate mood
    const validMoods: WishMood[] = ['温暖', '激励', '平静', '期待', '自由'];
    if (!validMoods.includes(result.mood)) {
      result.mood = '平静'; // Default fallback
    }

    // Ensure keywords is an array
    if (!Array.isArray(result.keywords)) {
      result.keywords = [];
    }

    // Ensure title exists
    if (!result.title || result.title.trim().length === 0) {
      result.title = description.slice(0, 20) + (description.length > 20 ? '...' : '');
    }

    return result;
  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    if (error instanceof SyntaxError) {
      throw new AIError('Failed to parse AI response', 'PARSE_ERROR');
    }
    throw new AIError(
      error instanceof Error ? error.message : 'Unknown error during classification',
      'API_ERROR'
    );
  }
}

/**
 * Fallback classification using keyword matching (no API needed)
 * @param description - The wish description to classify
 * @returns Classification result based on keyword matching
 */
export function classifyWishLocal(description: string): ClassificationResult {
  const text = description.toLowerCase();
  
  // Domain keywords mapping
  const domainKeywords: Record<WishDomain, string[]> = {
    '家人': ['爸', '妈', '父', '母', '家人', '家庭', '孩子', '子女', '父母', '亲人', '兄弟', '姐妹'],
    '事业': ['工作', '职业', '事业', '公司', '职位', '升职', '创业', '项目', '技能', '能力'],
    '钱': ['钱', '收入', '财富', '存款', '投资', '理财', '赚钱', '薪水', '资产', '被动收入', '交易', '出金', '盈利', '利润'],
    '健康': ['健康', '身体', '运动', '锻炼', '减肥', '睡眠', '情绪', '心理', '医疗', '养生'],
    '创造': ['创作', '创造', '写作', '小说', '艺术', '音乐', '画', '设计', '作品', '表达'],
    '生活': ['生活', '日常', '习惯', '环境', '城市', '房子', '旅行', '体验', '品质'],
    '爱': ['爱', '爱情', '恋爱', '伴侣', '婚姻', '感情', '关系', '约会', '心动'],
  };

  // Mood keywords mapping
  const moodKeywords: Record<WishMood, string[]> = {
    '温暖': ['温暖', '陪伴', '家人', '关心', '照顾', '幸福', '美好'],
    '激励': ['努力', '奋斗', '挑战', '突破', '成功', '目标', '成就'],
    '平静': ['平静', '安稳', '稳定', '放松', '安心', '舒适', '从容'],
    '期待': ['期待', '希望', '梦想', '未来', '可能', '憧憬', '向往'],
    '自由': ['自由', '独立', '自主', '选择', '探索', '冒险', '无拘'],
  };

  // Find best matching domain
  let bestDomain: WishDomain = '生活';
  let maxDomainScore = 0;
  for (const [domain, keywords] of Object.entries(domainKeywords) as [WishDomain, string[]][]) {
    const score = keywords.filter(kw => text.includes(kw)).length;
    if (score > maxDomainScore) {
      maxDomainScore = score;
      bestDomain = domain;
    }
  }

  // Find best matching mood
  let bestMood: WishMood = '平静';
  let maxMoodScore = 0;
  for (const [mood, keywords] of Object.entries(moodKeywords) as [WishMood, string[]][]) {
    const score = keywords.filter(kw => text.includes(kw)).length;
    if (score > maxMoodScore) {
      maxMoodScore = score;
      bestMood = mood;
    }
  }

  // Extract simple keywords (nouns that appear in the description)
  const keywords: string[] = [];
  for (const kws of Object.values(domainKeywords)) {
    for (const kw of kws) {
      if (text.includes(kw) && !keywords.includes(kw) && keywords.length < 3) {
        keywords.push(kw);
      }
    }
  }

  // Generate title (first 15 chars or up to first punctuation)
  const titleEnd = Math.min(
    description.length,
    15,
    ...[description.indexOf('，'), description.indexOf('。'), description.indexOf('！')]
      .filter(i => i > 0)
  );
  const title = description.slice(0, titleEnd).trim() + (titleEnd < description.length ? '' : '');

  return {
    domain: bestDomain,
    keywords: keywords.length > 0 ? keywords : ['生活', '愿望'],
    mood: bestMood,
    title: title || description.slice(0, 15),
  };
}

const WISHFLOW_ART_DIRECTION = `愿航线条图美术语法：
- 低刺激、暖白底、soft ink / 低饱和紫灰线条。
- 简笔画、单线条感、轻微手绘抖动，但主体必须清晰可识别。
- 不出现文字、数字、logo、大面积实心填充、写实阴影、照片风格。
- 每张图最多 1 个主体 + 2 到 4 个辅助元素。
- 主体使用 stroke-width 2.2-3，细节使用 1.2-1.8。
- 所有线条使用 stroke-linecap="round" stroke-linejoin="round"。
- 动画只用于水、风、云、星光等流动元素，不给主体加大幅动画。`;

const SCENE_SPEC_PROMPT = `你是 Wishflow 愿航的视觉策划。请把用户愿望转成适合简笔画 SVG 的场景规格。

${WISHFLOW_ART_DIRECTION}

返回严格 JSON，不要输出其他文字：
{
  "subject": "一个具体可画的主体，用英文短语描述",
  "supportingElements": ["2-4个辅助元素，用英文短语描述"],
  "composition": "主体位置与前后层次，英文一句话",
  "motionElements": ["可以轻微动画的流动元素，如 waves/clouds/stars，没有则空数组"],
  "avoid": ["text", "numbers", "logos", "large filled areas"],
  "style": "single-line wobbly warm minimal SVG, no text"
}

愿望描述：
{description}`;

// SVG Generation prompt template
const SVG_GENERATION_PROMPT = `你是 Wishflow 愿航的 SVG 简笔画插画师。根据 scene spec 生成一幅稳定、可识别、低刺激的愿望线条图。

【任务】
根据结构化 scene spec 绘制 SVG。请画具体主体，不要画抽象符号。

${WISHFLOW_ART_DIRECTION}

【绘图要求 - 非常重要】
1. 画具体的东西，不要抽象图形：
   - 邮轮/船：船体、船舱、窗户、烟囱、海浪。
   - 旅行：飞机/行李箱/地标/路线。
   - 家人：2-4个简笔人物 + 家/桌子/船等场景。
   - 房子：屋顶、门、窗、路。
   - 钱/财富：钱袋、硬币、账本、上升但不要进度条。
   - 健康：小人、叶子、心跳线、跑步姿态。
   - 创造：笔、书页、画框、电脑、星光。
   
2. 画面构图：
   - viewBox 必须是 "0 0 400 220"。
   - 主体放在中心偏下（x=90-310, y=80-170）。
   - 背景元素放后面，辅助元素放角落或主体附近。
   - 避免过多元素，保持安静。
   
3. 线条风格：
   - 主体用粗线 stroke-width="2.4"。
   - 细节用细线 stroke-width="1.4"。
   - 每个 path/line/polyline/rect/circle 都要设置圆角线条属性或继承自 <g>。

【颜色】
- 主体线: #2E2B33
- 辅助线: #6B5C8E
- 背景线: #B5A8D0
- fill: none，除非是极小点状装饰。

【动画 - 只给流动元素添加】
<style>
@keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
</style>

- 海浪：stroke-dasharray="15 8" style="animation: wave 3s linear infinite"
- 云朵：style="animation: float 4s ease-in-out infinite"
- 固定物体（船、房子、人）：不加动画！

【示例 - 邮轮旅行】
<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
<style>@keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }</style>
<!-- 海浪背景 -->
<path d="M0 160 Q50 150 100 160 T200 160 T300 160 T400 160" stroke="#B5A8D0" stroke-width="2" fill="none" stroke-dasharray="15 8" style="animation: wave 3s linear infinite"/>
<path d="M0 175 Q50 165 100 175 T200 175 T300 175 T400 175" stroke="#B5A8D0" stroke-width="1.5" fill="none" stroke-dasharray="12 6" style="animation: wave 4s linear infinite"/>
<!-- 邮轮主体 -->
<path d="M120 140 L280 140 L300 160 L100 160 Z" stroke="#6B5C8E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<!-- 船舱 -->
<rect x="150" y="115" width="100" height="25" rx="3" stroke="#6B5C8E" stroke-width="2" fill="none"/>
<!-- 烟囱 -->
<rect x="220" y="95" width="20" height="20" stroke="#6B5C8E" stroke-width="2" fill="none"/>
<!-- 窗户 -->
<circle cx="170" cy="127" r="5" stroke="#8E7BB0" stroke-width="1.5" fill="none"/>
<circle cx="200" cy="127" r="5" stroke="#8E7BB0" stroke-width="1.5" fill="none"/>
<circle cx="230" cy="127" r="5" stroke="#8E7BB0" stroke-width="1.5" fill="none"/>
<!-- 人物剪影（在甲板上）-->
<circle cx="140" cy="130" r="4" fill="#6B5C8E"/>
<line x1="140" y1="134" x2="140" y2="140" stroke="#6B5C8E" stroke-width="1.5"/>
<circle cx="155" cy="128" r="4" fill="#6B5C8E"/>
<line x1="155" y1="132" x2="155" y2="140" stroke="#6B5C8E" stroke-width="1.5"/>
<!-- 太阳 -->
<circle cx="350" cy="40" r="15" stroke="#8E7BB0" stroke-width="2" fill="none"/>
</svg>

【输出要求】
1. 只输出 <svg>...</svg>，不要其他文字
2. viewBox="0 0 400 220"
3. 画具体的场景，不要只画几何图形
4. 主体要清晰可辨认
5. 禁止 <text>、<script>、<foreignObject>、外链、onload/onclick 等事件属性

【用户愿望描述】
{description}

【Scene Spec JSON】
{sceneSpec}

请根据 scene spec 生成具象的 SVG 插画：`;

const SVG_RETRY_PROMPT = `${SVG_GENERATION_PROMPT}

上一次 SVG 没有通过质量检查，问题如下：
{issues}

请修正这些问题，只输出新的 <svg>...</svg>。`;

function extractTextContent(response: { content?: Array<{ type: string; text?: string }> }): string {
  const textContent = response.content?.find(block => block.type === 'text');
  if (!textContent || textContent.type !== 'text' || !textContent.text) {
    throw new AIError('No text response from Claude', 'INVALID_RESPONSE');
  }
  return textContent.text;
}

function extractJson<T>(raw: string): T {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new AIError('Could not parse JSON from response', 'PARSE_ERROR');
  }
  return JSON.parse(jsonMatch[0]) as T;
}

function extractSvg(raw: string): string | null {
  const svgMatch = raw.match(/<svg[\s\S]*?<\/svg>/i);
  return svgMatch ? svgMatch[0] : null;
}

function buildSvgPrompt(template: string, description: string, sceneSpec: WishSceneSpec, issues?: string[]): string {
  return template
    .replace('{description}', description)
    .replace('{sceneSpec}', JSON.stringify(sceneSpec, null, 2))
    .replace('{issues}', issues?.map(issue => `- ${issue}`).join('\n') ?? '');
}

export function sanitizeWishSvg(svg: string): string {
  let safe = svg.trim();
  safe = safe.replace(/<script[\s\S]*?<\/script>/gi, '');
  safe = safe.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
  safe = safe.replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '');
  safe = safe.replace(/\s+(href|xlink:href)\s*=\s*(['"])\s*(https?:|data:|javascript:)[\s\S]*?\2/gi, '');
  safe = safe.replace(/<text[\s\S]*?<\/text>/gi, '');
  safe = safe.replace(/<svg(?![^>]*viewBox=)/i, '<svg viewBox="0 0 400 220"');
  safe = safe.replace(/viewBox=(['"])[^'"]*\1/i, 'viewBox="0 0 400 220"');
  return safe;
}

export function validateWishSvg(svg: string): SVGValidationResult {
  const issues: string[] = [];
  const safe = sanitizeWishSvg(svg);

  if (!/^<svg[\s\S]*<\/svg>$/i.test(safe)) {
    issues.push('SVG must contain a single root <svg> element.');
  }
  if (!/viewBox="0 0 400 220"/i.test(safe)) {
    issues.push('SVG must use viewBox="0 0 400 220".');
  }
  if (/<(?:script|foreignObject|text)\b/i.test(safe)) {
    issues.push('SVG must not include script, foreignObject, or text elements.');
  }
  if (/\son[a-z]+\s*=/i.test(safe)) {
    issues.push('SVG must not include event handler attributes.');
  }
  if (/\b(?:href|xlink:href)\s*=\s*(['"])\s*(?:https?:|data:|javascript:)/i.test(safe)) {
    issues.push('SVG must not include external links or data URLs.');
  }

  const drawableCount = (safe.match(/<(path|circle|ellipse|rect|line|polyline|polygon)\b/gi) ?? []).length;
  const pathCount = (safe.match(/<path\b/gi) ?? []).length;
  if (drawableCount < 6 || pathCount < 3) {
    issues.push('SVG is too sparse; include a recognizable subject with details.');
  }
  if (drawableCount > 48) {
    issues.push('SVG is too busy; keep the drawing calm and minimal.');
  }
  if (!/stroke-linecap="round"/i.test(safe) || !/stroke-linejoin="round"/i.test(safe)) {
    issues.push('SVG should use round line caps and joins.');
  }
  if (/fill="(?!none|transparent)[^"]+"/i.test(safe)) {
    const filledCount = (safe.match(/fill="(?!none|transparent)[^"]+"/gi) ?? []).length;
    if (filledCount > 3) issues.push('SVG has too many filled shapes; keep it mostly line art.');
  }

  return {
    ok: issues.length === 0,
    svg: safe,
    issues,
  };
}

export async function generateWishSceneSpec(description: string): Promise<WishSceneSpec> {
  if (!description || description.trim().length < 5) {
    throw new AIError('Description is too short', 'INVALID_INPUT');
  }

  const client = createClient();
  const prompt = SCENE_SPEC_PROMPT.replace('{description}', description);

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 900,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = extractTextContent(response);
  const result = extractJson<WishSceneSpec>(raw);

  return {
    subject: result.subject || 'a quiet symbolic object',
    supportingElements: Array.isArray(result.supportingElements) ? result.supportingElements.slice(0, 4) : [],
    composition: result.composition || 'Centered subject, calm background, a few small supporting elements.',
    motionElements: Array.isArray(result.motionElements) ? result.motionElements.slice(0, 3) : [],
    avoid: Array.isArray(result.avoid) ? result.avoid : ['text', 'numbers', 'logos', 'large filled areas'],
    style: result.style || 'single-line wobbly warm minimal SVG, no text',
  };
}

/**
 * Generate SVG visualization using Claude AI
 * @param description - The wish description to visualize
 * @returns SVG string and success status
 */
export async function generateWishSVGWithAI(description: string): Promise<SVGGenerationResult> {
  logger.debug('[SVG Generator] Starting AI SVG generation for:', description.slice(0, 50) + '...');
  
  if (!description || description.trim().length < 5) {
    logger.debug('[SVG Generator] Error: Description too short');
    return { svg: '', success: false, error: 'Description too short' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    logger.debug('[SVG Generator] Error: API key not configured');
    return { svg: '', success: false, error: 'API key not configured' };
  }

  const client = new Anthropic({ apiKey });

  try {
    logger.debug('[SVG Generator] Creating scene spec...');
    const sceneSpec = await generateWishSceneSpec(description);
    logger.debug('[SVG Generator] Scene spec:', sceneSpec);

    logger.debug('[SVG Generator] Calling Claude API...');
    const startTime = Date.now();

    async function requestSvg(prompt: string) {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });
      return extractTextContent(response);
    }

    let raw = await requestSvg(buildSvgPrompt(SVG_GENERATION_PROMPT, description, sceneSpec));
    logger.debug('[SVG Generator] Raw response length:', raw.length);

    let svg = extractSvg(raw);
    if (!svg) {
      logger.debug('[SVG Generator] Error: No SVG found in response');
      logger.debug('[SVG Generator] Response preview:', raw.slice(0, 200));
      return { svg: '', success: false, error: 'No SVG found in response', sceneSpec };
    }

    let validation = validateWishSvg(svg);
    if (!validation.ok) {
      logger.debug('[SVG Generator] SVG validation failed, retrying:', validation.issues);
      raw = await requestSvg(buildSvgPrompt(SVG_RETRY_PROMPT, description, sceneSpec, validation.issues));
      svg = extractSvg(raw);
      if (!svg) {
        return { svg: '', success: false, error: 'Retry did not return SVG', sceneSpec, validationIssues: validation.issues };
      }
      validation = validateWishSvg(svg);
    }

    if (!validation.ok || !validation.svg) {
      logger.debug('[SVG Generator] SVG validation failed after retry:', validation.issues);
      return {
        svg: validation.svg ?? '',
        success: false,
        error: `SVG failed quality checks: ${validation.issues.join('; ')}`,
        sceneSpec,
        validationIssues: validation.issues,
      };
    }

    const elapsed = Date.now() - startTime;
    logger.debug(`[SVG Generator] Claude API responded in ${elapsed}ms`);
    logger.debug('[SVG Generator] Success! SVG generated successfully');
    return { svg: validation.svg, success: true, sceneSpec };

  } catch (error) {
    logger.error('[SVG Generator] API Error:', error);
    return {
      svg: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
