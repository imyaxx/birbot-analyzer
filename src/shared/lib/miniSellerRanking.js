import i18next from 'i18next';

export const normalizeShopKey = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/["«»''`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isFiniteNumber = (value) => Number.isFinite(Number(value));

const DEFAULT_MAX_DISCOUNT_PCT = 5;
const DEFAULT_MAX_GAIN_CAP = 5;

export function computeSimulatedUser(userShopBase, sliderValue, scoringInputs = {}) {
  if (!userShopBase) return null;
  const basePrice = Number(userShopBase.priceBase);
  const baseRank = Number(userShopBase.rankBase);
  if (!isFiniteNumber(basePrice) || !isFiniteNumber(baseRank) || baseRank <= 0) return null;

  const discountPct = Math.max(0, Number(sliderValue) || 0);
  const maxDiscountPct = scoringInputs.maxDiscountPct ?? DEFAULT_MAX_DISCOUNT_PCT;
  const safeMaxDiscount = maxDiscountPct > 0 ? maxDiscountPct : DEFAULT_MAX_DISCOUNT_PCT;
  const price = Math.max(0, Math.round(basePrice * (1 - discountPct / 100)));

  const maxGainCap = scoringInputs.maxGainCap ?? DEFAULT_MAX_GAIN_CAP;
  const maxGain = Math.min(maxGainCap, Math.max(baseRank - 1, 0));
  const improvement = Math.round((discountPct / safeMaxDiscount) * maxGain);
  const rank = Math.max(1, baseRank - improvement);

  return {
    rank,
    price,
    name: userShopBase.name,
    rating: userShopBase.rating ?? null,
    reviewCount: userShopBase.reviewCount ?? null,
  };
}

export function buildMiniRating(
  top5Sellers,
  computedUser,
  userShopName,
  labels = { userTitle: i18next.t('analysis.ranking.yourShop') },
) {
  const topSorted = Array.isArray(top5Sellers) ? [...top5Sellers] : [];
  topSorted.sort((a, b) => Number(a.rank) - Number(b.rank));

  const seenTopKeys = new Set();
  const topRenderBase = [];
  for (const seller of topSorted) {
    const name = String(seller?.name ?? '');
    const key = normalizeShopKey(name);
    if (!key) continue;
    if (seenTopKeys.has(key)) continue;
    seenTopKeys.add(key);

    topRenderBase.push({
      uniqueId: `top-${key}`,
      type: 'top',
      rankLabel: `#${Number(seller.rank)}`,
      title: name,
      subtitle: '',
      price: Number(seller.price),
      isHighlighted: false,
      rating: seller.rating ?? null,
      reviewCount: seller.reviewCount ?? null,
    });
  }

  const hasUserData =
    computedUser &&
    isFiniteNumber(computedUser.rank) &&
    isFiniteNumber(computedUser.price) &&
    Number(computedUser.rank) > 0;

  if (!hasUserData) {
    return topRenderBase;
  }

  const userRank = Number(computedUser.rank);
  const userPrice = Number(computedUser.price);
  const userKey = normalizeShopKey(String(computedUser?.name ?? userShopName ?? ''));
  const withoutUserDuplicates = userKey
    ? topRenderBase.filter((item) => normalizeShopKey(item.title) !== userKey)
    : topRenderBase;

  const userItem = {
    uniqueId: 'user',
    type: 'user',
    rankLabel: `#${userRank}`,
    title: labels.userTitle,
    subtitle: String(userShopName ?? ''),
    price: userPrice,
    isHighlighted: true,
    rating: computedUser?.rating ?? null,
    reviewCount: computedUser?.reviewCount ?? null,
  };

  if (userRank >= 1 && userRank <= 5) {
    const withoutRank = withoutUserDuplicates.filter(
      (item) => item.rankLabel !== userItem.rankLabel,
    );
    const insertIndex = withoutRank.findIndex((item) => Number(item.rankLabel.slice(1)) > userRank);
    if (insertIndex === -1) {
      return [...withoutRank, userItem];
    }
    return [...withoutRank.slice(0, insertIndex), userItem, ...withoutRank.slice(insertIndex)];
  }

  return [...withoutUserDuplicates, userItem];
}
