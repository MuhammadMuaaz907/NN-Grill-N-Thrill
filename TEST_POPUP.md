# Popup Testing Guide

## Quick Test (If popup not showing)

1. **Clear localStorage** (Browser Console me):
```javascript
localStorage.removeItem('lastPromotionDismissDate');
localStorage.removeItem('dismissedPromotions');
```

2. **Refresh page** - Popup should show after 1.5 seconds

3. **Check console logs**:
   - `📊 Promotions API Response:` - Should show promotions data
   - `✅ Showing promotion popup` - Should appear
   - `🎉 Popup state set to true` - Should appear

## Verify Popup is Working

1. Go to `/admin/promotions`
2. Create a promotion with:
   - Title: "Test Promotion"
   - Description: "Test description"
   - Valid From: Today
   - Valid Until: Future date (30 days)
   - Active: Yes
   - Discount: 10%

3. Go to homepage (`/`)
4. Clear localStorage (see above)
5. Refresh page
6. Popup should appear in center after 1.5 seconds

## Popup Features

- ✅ Centered on screen (both X and Y axis)
- ✅ Backdrop overlay (click to close)
- ✅ Close button (top right)
- ✅ "Shop Now" button (scrolls to menu)
- ✅ "Maybe Later" button (dismisses for today)
- ✅ Auto-dismiss after 10 seconds
- ✅ Shows again tomorrow (if not dismissed today)

## Debugging

If popup still not showing:

1. Check browser console for errors
2. Check Network tab - `/api/promotions?active=true` should return data
3. Check React DevTools - `showPromotionPopup` state should be `true`
4. Verify promotions exist in database and are active

