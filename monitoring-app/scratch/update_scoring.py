import json

with open(r'd:\Magang\monitoring-app\scratch\scoring_extracted.json', 'r', encoding='utf-8') as f:
    extracted = json.load(f)

with open(r'd:\Magang\monitoring-app\scratch\categories.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

ts_content = f'''export const SCORING_RULES = {json.dumps(extracted['rules'], indent=2)};

export const KEYWORD_CATEGORIES: Record<string, string[]> = {json.dumps(categories, indent=2)};

export function getKategoriMedia(mediaType: string): string {{
  const type = (mediaType || '').toUpperCase();
  if (type === 'VIDEO') return 'Instagram Reels';
  if (type === 'IMAGE' || type === 'CAROUSEL_ALBUM') return 'Instagram Feeds';
  return 'Instagram Feeds'; // Default
}}

export function getScoreByLikes(platform: string, likes: number): number {{
  const platformRules = SCORING_RULES.filter(r => r.platform.toLowerCase() === platform.toLowerCase());
  
  for (const rule of platformRules) {{
    if (likes >= rule.min_likes) {{
      return rule.score;
    }}
  }}
  return 0; // default score if no rule matches
}}

export function getKategoriAuto(text: string): string {{
  if (!text) return '-';
  const textLower = text.toLowerCase();
  
  // Return the first category that has a matching keyword (substring match)
  for (const [category, keywords] of Object.entries(KEYWORD_CATEGORIES)) {{
    for (const kw of keywords) {{
      if (textLower.includes(kw.toLowerCase())) {{
        return category;
      }}
    }}
  }}
  return '-';
}}

export function findMatchingKeywords(text: string): string[] {{
  if (!text) return [];
  const textLower = text.toLowerCase();
  const matched = [];
  
  for (const keywords of Object.values(KEYWORD_CATEGORIES)) {{
    for (const kw of keywords) {{
      if (textLower.includes(kw.toLowerCase())) {{
        matched.push(kw);
      }}
    }}
  }}
  return Array.from(new Set(matched));
}}

export function calculatePostScore(post: {{ media_type?: string; likes: number; caption?: string }}): {{ score: number; kategori: string; keywords: string[]; platform: string }} {{
  const platform = getKategoriMedia(post.media_type || '');
  const score = getScoreByLikes(platform, post.likes);
  const kategori = getKategoriAuto(post.caption || '');
  const keywords = findMatchingKeywords(post.caption || '');
  
  return {{
    platform,
    score,
    kategori,
    keywords
  }};
}}
'''

with open(r'd:\Magang\monitoring-app\src\lib\scoring.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("scoring.ts updated successfully")
