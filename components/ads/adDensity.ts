/**
 * Ties ad density to content length so short pages never get overwhelmed
 * relative to how much they actually have to say. `in-article-top` and
 * `article-end` are cheap enough (one slot bookending the content) to show
 * on every article; the mid-content, sidebar, and mobile-sticky slots only
 * earn their place once there's enough content to justify them.
 */
export interface ArticleAdPlan {
  mid35: boolean;
  mid70: boolean;
  sidebar: boolean;
  mobileSticky: boolean;
}

const MEDIUM_WORD_THRESHOLD = 350;
const LONG_WORD_THRESHOLD = 700;

export function getArticleAdPlan(wordCount: number): ArticleAdPlan {
  if (wordCount < MEDIUM_WORD_THRESHOLD) {
    return { mid35: false, mid70: false, sidebar: false, mobileSticky: false };
  }
  if (wordCount < LONG_WORD_THRESHOLD) {
    return { mid35: true, mid70: false, sidebar: true, mobileSticky: true };
  }
  return { mid35: true, mid70: true, sidebar: true, mobileSticky: true };
}
