/**
 * Wish Classification API Route / 愿望分类 API 路由
 * POST /api/classify - Classify a wish description using Claude AI
 * Optionally generate SVG visualization with generateSVG: true
 */

import { NextRequest, NextResponse } from 'next/server';
import { classifyWish, classifyWishLocal, generateWishSVGWithAI, AIError } from '@/lib/ai';
import { generateWishSVG, renderSVGToString } from '@/lib/svgGenerator';
import { WishDomain, WishMood } from '@/lib/types';
import { logger } from "@/lib/logger";
export async function POST(request: NextRequest) {
  logger.debug('[API /classify] Request received');
  
  try {
    const body = await request.json();
    const { description, useLocal = false, generateSVG = false } = body;

    logger.debug('[API /classify] Params:', { 
      descLength: description?.length, 
      useLocal, 
      generateSVG 
    });

    // Validate input
    if (!description || typeof description !== 'string') {
      logger.debug('[API /classify] Error: Missing description');
      return NextResponse.json(
        { error: '请提供愿望描述', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (description.trim().length < 5) {
      logger.debug('[API /classify] Error: Description too short');
      return NextResponse.json(
        { error: '愿望描述太短，请至少输入5个字', code: 'DESCRIPTION_TOO_SHORT' },
        { status: 400 }
      );
    }

    // Classification result
    let classification;
    let classificationSource = 'local';

    // Use local classification if requested or if API key is not set
    if (useLocal || !process.env.ANTHROPIC_API_KEY) {
      logger.debug('[API /classify] Using local classification');
      classification = classifyWishLocal(description);
      classificationSource = 'local';
    } else {
      // Use Claude API for classification
      logger.debug('[API /classify] Using Claude API for classification');
      classification = await classifyWish(description);
      classificationSource = 'claude';
    }

    logger.debug('[API /classify] Classification result:', {
      title: classification.title,
      domain: classification.domain,
      keywords: classification.keywords,
      source: classificationSource
    });

    // SVG generation (if requested)
    let svg: string | undefined;
    let svgFallback = false;
    let svgQualityIssues: string[] | undefined;
    let sceneSpec;

    if (generateSVG) {
      logger.debug('[API /classify] Starting SVG generation...');
      
      // Try AI-powered SVG generation first
      if (process.env.ANTHROPIC_API_KEY && !useLocal) {
        const svgResult = await generateWishSVGWithAI(description);
        sceneSpec = svgResult.sceneSpec;
        svgQualityIssues = svgResult.validationIssues;
        if (svgResult.success && svgResult.svg) {
          logger.debug('[API /classify] AI SVG generation succeeded');
          svg = svgResult.svg;
        } else {
          // Fallback to domain-based template
          logger.debug('[API /classify] AI SVG failed, using fallback:', svgResult.error);
          const templateSVG = generateWishSVG(
            classification.domain as WishDomain,
            classification.mood as WishMood,
            description
          );
          svg = renderSVGToString(templateSVG);
          svgFallback = true;
        }
      } else {
        // No API key, use template directly
        logger.debug('[API /classify] No API key, using template SVG');
        const templateSVG = generateWishSVG(
          classification.domain as WishDomain,
          classification.mood as WishMood,
          description
        );
        svg = renderSVGToString(templateSVG);
        svgFallback = true;
      }
      
      logger.debug('[API /classify] SVG result:', { 
        svgLength: svg?.length, 
        svgFallback,
        svgQualityIssues,
      });
    }

    logger.debug('[API /classify] Returning response');
    return NextResponse.json({
      ...classification,
      source: classificationSource,
      ...(generateSVG && { svg, svgFallback, sceneSpec, svgQualityIssues }),
    });

  } catch (error) {
    logger.error('Classification error:', error);

    if (error instanceof AIError) {
      // Handle known AI errors
      const statusMap: Record<string, number> = {
        'MISSING_API_KEY': 503,
        'INVALID_INPUT': 400,
        'INVALID_RESPONSE': 502,
        'PARSE_ERROR': 502,
        'API_ERROR': 502,
      };
      
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: statusMap[error.code] || 500 }
      );
    }

    // Fallback to local classification on API errors
    try {
      const body = await request.clone().json();
      const result = classifyWishLocal(body.description);
      return NextResponse.json({
        ...result,
        source: 'local',
        fallback: true,
      });
    } catch {
      return NextResponse.json(
        { error: '分类服务暂时不可用', code: 'SERVICE_UNAVAILABLE' },
        { status: 503 }
      );
    }
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    status: 'ok',
    claudeAvailable: hasApiKey,
    fallbackAvailable: true,
  });
}
