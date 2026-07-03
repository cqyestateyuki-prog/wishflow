/**
 * Try Page / 体验页
 * Free trial for wish visualization - saves to localStorage without login
 * 无需登录即可体验愿望可视化 - 自动保存到本地
 */
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { logger } from '@/lib/logger';
import { MoonNew, MoonCrescent, MoonFull } from '@/components/Icons';
import { wishStore } from '@/lib/localStore';
import { TimeScope, TargetTime, WishDomain, WishMood } from '@/lib/types';
import { ClassificationResult } from '@/lib/ai';
import { DOMAINS } from '@/lib/constants';

type Step = 'input' | 'generating' | 'preview' | 'saved';

// Generation progress steps
type GenerationStep = 'analyzing' | 'classifying' | 'generating' | 'done';

// Helper to translate domain to English
function getDomainLabel(domain: string, language: string): string {
  if (language === 'en') {
    const domainEntry = DOMAINS.find(d => d.label === domain);
    return domainEntry?.labelEn || domain;
  }
  return domain;
}

// Extended classification result with SVG
type ClassificationWithSVG = ClassificationResult & {
  svg?: string;
  svgFallback?: boolean;
};

export default function TryPage() {
  const { language } = useLanguage();
  
  // Form state
  const [description, setDescription] = useState('');
  const [timeScope, setTimeScope] = useState<TimeScope>('long');
  const [targetTime, setTargetTime] = useState<TargetTime>('years');
  
  // AI classification result
  const [classification, setClassification] = useState<ClassificationWithSVG | null>(null);
  
  // UI state
  const [step, setStep] = useState<Step>('input');
  const [generationStep, setGenerationStep] = useState<GenerationStep>('analyzing');
  const [generatedSVG, setGeneratedSVG] = useState<string | null>(null);
  const [svgFallback, setSvgFallback] = useState(false);
  const [savedWishId, setSavedWishId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Call AI classification + SVG generation API
  const classifyAndGenerateSVG = useCallback(async (desc: string): Promise<ClassificationWithSVG> => {
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: desc,
          generateSVG: true  // Request SVG generation
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        logger.error('API Error:', data);
        throw new Error(data.error || 'Classification failed');
      }
      
      return await response.json();
    } catch (err) {
      logger.error('Classification error:', err);
      
      // Show user-friendly error message
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('credit balance') || errorMessage.includes('502')) {
        logger.debug('AI service temporarily unavailable, using fallback');
      }
      
      // Fallback: return default classification without SVG
      return {
        domain: '生活' as WishDomain,
        keywords: ['愿望'],
        mood: '平静' as WishMood,
        title: desc.slice(0, 20) + (desc.length > 20 ? '...' : ''),
        svgFallback: true,
      };
    }
  }, []);

  // Generate visualization with animation
  const handleGenerate = useCallback(async () => {
    if (!description.trim() || description.trim().length < 5) {
      setError(language === 'zh' ? '请至少输入5个字描述你的愿望' : 'Please enter at least 5 characters');
      return;
    }
    
    setError(null);
    setStep('generating');
    setGenerationStep('analyzing');
    
    // Simulate initial analysis progress
    await new Promise(resolve => setTimeout(resolve, 600));
    setGenerationStep('classifying');
    
    // Call AI classification + SVG generation
    const result = await classifyAndGenerateSVG(description);
    setClassification(result);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setGenerationStep('generating');
    
    // Set SVG from API response
    if (result.svg) {
      setGeneratedSVG(result.svg);
      setSvgFallback(result.svgFallback || false);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setGenerationStep('done');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setStep('preview');
  }, [description, classifyAndGenerateSVG, language]);

  // Save wish to localStorage
  const handleSave = useCallback(() => {
    if (!classification) return;
    
    const seed = description.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const newWish = wishStore.add({
      title: classification.title,
      description: description.trim(),
      domain: classification.domain,
      stage: null, // Can be added later
      will_source: null,
      end_scene: null,
      time_scope: timeScope,
      target_time: targetTime,
      svg_pattern: classification.domain,
      svg_data: generatedSVG || null,  // Save AI-generated SVG
      keywords: classification.keywords,
      mood: classification.mood,
      line_seed: String(seed),
      pinned: false,
      last_connected_at: null,
      last_level: null,
    });
    
    setSavedWishId(newWish.id);
    setStep('saved');
  }, [description, classification, generatedSVG, timeScope, targetTime]);

  // Reset to create another
  const handleReset = useCallback(() => {
    setDescription('');
    setTimeScope('long');
    setTargetTime('years');
    setClassification(null);
    setGeneratedSVG(null);
    setSvgFallback(false);
    setStep('input');
    setSavedWishId(null);
    setError(null);
  }, []);

  return (
    <div className="container" style={{ paddingTop: 48, maxWidth: 920 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 className="h1" style={{ margin: 0 }}>
          {language === 'zh' ? '生成愿望意象图' : 'Generate Wish Visualization'}
        </h1>
        <p className="muted" style={{ marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
          {language === 'zh' 
            ? '描述你的愿望，AI 会为你生成专属的流动图案。无需注册，自动保存到本地。' 
            : 'Describe your wish and AI will generate a unique flowing visualization. No sign-up needed.'}
        </p>
      </div>

      {/* Step 1: Input Form */}
      {step === 'input' && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Description */}
            <div>
              <label className="muted" style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 15 }}>
                {language === 'zh' ? '请描述你的愿望 *' : 'Describe your wish *'}
              </label>
              <textarea
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.6)',
                  fontSize: 16,
                  minHeight: 120,
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
                placeholder={language === 'zh' 
                  ? '例如：我想带爸爸妈妈去一次邮轮旅行，让他们在海上放松休息，一家人留下美好的回忆...' 
                  : 'e.g., I want to take my parents on a cruise trip, let them relax on the sea...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && (
                <p style={{ color: '#e74c3c', fontSize: 13, marginTop: 8 }}>{error}</p>
              )}
            </div>

            {/* Time Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Time Scope */}
              <div>
                <label className="muted" style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                  {language === 'zh' ? '这是什么类型的愿望？' : 'What type of wish is this?'}
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setTimeScope('short')}
                    className={timeScope === 'short' ? 'btn primary' : 'btn'}
                    style={{ flex: 1, padding: '10px 12px', fontSize: 13 }}
                  >
                    {language === 'zh' ? '短期愿望' : 'Short-term'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeScope('long')}
                    className={timeScope === 'long' ? 'btn primary' : 'btn'}
                    style={{ flex: 1, padding: '10px 12px', fontSize: 13 }}
                  >
                    {language === 'zh' ? '长期愿望' : 'Long-term'}
                  </button>
                </div>
              </div>

              {/* Target Time */}
              <div>
                <label className="muted" style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                  {language === 'zh' ? '你希望什么时候实现？' : 'When do you want to achieve it?'}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setTargetTime('weeks')}
                    className={targetTime === 'weeks' ? 'btn primary' : 'btn'}
                    style={{ flex: 1, padding: '10px 8px', fontSize: 12 }}
                  >
                    {language === 'zh' ? '几周内' : 'Weeks'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetTime('months')}
                    className={targetTime === 'months' ? 'btn primary' : 'btn'}
                    style={{ flex: 1, padding: '10px 8px', fontSize: 12 }}
                  >
                    {language === 'zh' ? '几个月' : 'Months'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetTime('years')}
                    className={targetTime === 'years' ? 'btn primary' : 'btn'}
                    style={{ flex: 1, padding: '10px 8px', fontSize: 12 }}
                  >
                    {language === 'zh' ? '几年内' : 'Years'}
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="btn dark" 
              onClick={handleGenerate}
              disabled={!description.trim() || description.trim().length < 5}
              style={{ 
                padding: '14px 24px',
                fontSize: 16,
                marginTop: 8,
                background: 'var(--wish)',
                borderColor: 'var(--wish)',
                color: '#fff',
                opacity: (!description.trim() || description.trim().length < 5) ? 0.5 : 1,
                cursor: (!description.trim() || description.trim().length < 5) ? 'not-allowed' : 'pointer'
              }}
            >
              {language === 'zh' ? '生成我的愿望图' : 'Generate My Wish Image'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Generating Animation */}
      {step === 'generating' && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          {/* Animated SVG placeholder */}
          <div style={{ 
            width: 200, 
            height: 200, 
            margin: '0 auto 24px',
            display: 'grid',
            placeItems: 'center',
          }}>
            <svg viewBox="0 0 100 100" style={{ width: 120, height: 120 }}>
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="var(--wish)" 
                strokeWidth="3"
                strokeDasharray="60 200"
                style={{ 
                  animation: 'spin 1.5s linear infinite',
                  transformOrigin: 'center',
                }}
              />
              <circle 
                cx="50" cy="50" r="25" 
                fill="none" 
                stroke="var(--border)" 
                strokeWidth="2"
                strokeDasharray="40 100"
                style={{ 
                  animation: 'spin 2s linear infinite reverse',
                  transformOrigin: 'center',
                }}
              />
            </svg>
          </div>
          
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 20 }}>
            {language === 'zh' ? '正在为你的愿望绘制意象图...' : 'Creating your wish visualization...'}
          </h3>
          
          {/* Progress steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ 
                width: 20, height: 20, borderRadius: '50%', 
                background: 'var(--wish)',
                display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12,
              }}>
                {generationStep !== 'analyzing' ? '✓' : '●'}
              </span>
              <span style={{ 
                color: generationStep === 'analyzing' ? 'var(--ink)' : 'var(--text)',
                fontWeight: generationStep === 'analyzing' ? 600 : 400,
              }}>
                {language === 'zh' ? '分析愿望内容' : 'Analyzing your wish'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ 
                width: 20, height: 20, borderRadius: '50%', 
                background: generationStep === 'classifying' ? 'var(--wish)' : (['generating', 'done'].includes(generationStep) ? 'var(--wish)' : 'var(--border)'),
                display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12,
              }}>
                {['generating', 'done'].includes(generationStep) ? '✓' : (generationStep === 'classifying' ? '●' : '○')}
              </span>
              <span style={{ 
                color: generationStep === 'classifying' ? 'var(--ink)' : 'var(--text)',
                fontWeight: generationStep === 'classifying' ? 600 : 400,
              }}>
                {language === 'zh' ? '识别领域和关键词' : 'Identifying domain & keywords'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ 
                width: 20, height: 20, borderRadius: '50%', 
                background: generationStep === 'generating' ? 'var(--wish)' : (generationStep === 'done' ? 'var(--wish)' : 'var(--border)'),
                display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12,
              }}>
                {generationStep === 'done' ? '✓' : (generationStep === 'generating' ? '●' : '○')}
              </span>
              <span style={{ 
                color: generationStep === 'generating' ? 'var(--ink)' : 'var(--text)',
                fontWeight: generationStep === 'generating' ? 600 : 400,
              }}>
                {language === 'zh' ? '生成流动图案' : 'Generating flowing pattern'}
              </span>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && classification && (
        <div>
          {/* Visualization */}
          <div 
            style={{ 
              padding: 48,
              background: 'var(--paper)',
              borderRadius: 20,
              marginBottom: 24,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {generatedSVG ? (
              <div 
                dangerouslySetInnerHTML={{ __html: generatedSVG }}
                style={{ 
                  width: '100%', 
                  maxWidth: 500,
                  display: 'flex',
                  justifyContent: 'center'
                }}
                className="wish-svg-container"
              />
            ) : (
              <div style={{ 
                width: 400, 
                height: 220, 
                background: 'var(--border)', 
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--text)'
              }}>
                {language === 'zh' ? '图像生成中...' : 'Generating...'}
              </div>
            )}
            {svgFallback && (
              <p className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                {language === 'zh' ? '使用了默认线条样式' : 'Using the default line style'}
              </p>
            )}
            {!svgFallback && generatedSVG && (
              <p className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                {language === 'zh' ? 'AI 生成线条图' : 'AI-generated line drawing'}
              </p>
            )}
          </div>

          {/* Info */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
              {classification.title}
            </h2>
            <p className="muted" style={{ marginBottom: 16, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 16px', fontSize: 14 }}>
              {description}
            </p>

            {/* Tags - show only domain and one keyword */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
              <span className="badge" style={{ background: 'rgba(107, 92, 142, 0.15)', color: 'var(--wish)', fontWeight: 600 }}>
                {getDomainLabel(classification.domain, language)}
              </span>
              {classification.keywords.length > 0 && (
                <span className="badge" style={{ background: 'rgba(230, 225, 240, 0.5)' }}>
                  {classification.keywords[0]}
                </span>
              )}
            </div>

            {/* Connection levels info */}
            <div style={{ 
              padding: 20, 
              background: 'rgba(230, 225, 240, 0.2)', 
              borderRadius: 16,
              textAlign: 'left', 
              maxWidth: 420, 
              margin: '0 auto' 
            }}>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.9 }}>
                <div style={{ marginBottom: 8 }}>
                  <b><MoonNew size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{language === 'zh' ? '最低连接（2分钟）' : 'Minimum (2 min)'}：</b>
                  {language === 'zh' ? '看一眼意象图' : 'Look at the image'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b><MoonCrescent size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{language === 'zh' ? '正常连接（15分钟）' : 'Normal (15 min)'}：</b>
                  {language === 'zh' ? '写一句话' : 'Write a sentence'}
                </div>
                <div>
                  <b><MoonFull size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />{language === 'zh' ? '深度连接（60分钟）' : 'Deep (60 min)'}：</b>
                  {language === 'zh' ? '推进现实行动' : 'Take real action'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setStep('input')}>
              {language === 'zh' ? '返回编辑' : 'Back to Edit'}
            </button>
            <button className="btn" onClick={handleGenerate}>
              {language === 'zh' ? '重新生成一张' : 'Regenerate'}
            </button>
            <button 
              className="btn primary" 
              onClick={handleSave}
              style={{ background: 'var(--wish)', borderColor: 'var(--wish)', color: '#fff' }}
            >
              {language === 'zh' ? '保存愿望' : 'Save Wish'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Saved */}
      {step === 'saved' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 16px' }}>
            <circle cx="24" cy="24" r="16" stroke="#6B5C8E" strokeWidth="2.5" fill="none" opacity="0.3" />
            <circle cx="24" cy="24" r="10" fill="#6B5C8E" />
            <path d="M18 24 L22 28 L30 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
            {language === 'zh' ? '愿望已保存!' : 'Wish Saved!'}
          </h2>
          <p className="muted" style={{ marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            {language === 'zh' 
              ? '你的愿望已保存到本地，并已经进入愿力卡库。现在可以去查看、连接，或继续创建下一个。' 
              : 'Your wish is saved locally and now appears in Wish Gallery. You can view it, connect with it, or create another.'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/daily" className="btn">
              {language === 'zh' ? '今日连接' : 'Today'}
            </Link>
            <Link href="/overview" className="btn">
              {language === 'zh' ? '愿力地图' : 'Wish Map'}
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            <button className="btn" onClick={handleReset}>
              {language === 'zh' ? '再创建一个' : 'Create Another'}
            </button>
            <Link href="/wishes" className="btn primary" style={{ background: 'var(--wish)', borderColor: 'var(--wish)' }}>
              {language === 'zh' ? '查看愿望画廊' : 'View Wish Gallery'}
            </Link>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <p className="muted" style={{ fontSize: 13 }}>
              {language === 'zh' 
                ? '想要跨设备同步？' 
                : 'Want to sync across devices?'}
            </p>
            <Link href="/login" className="btn dark" style={{ marginTop: 12 }}>
              {language === 'zh' ? '登录账号' : 'Sign In'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
