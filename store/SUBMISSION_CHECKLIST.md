# Wishflow — App Store Submission Checklist

Bilingual checklist for app store submissions.  
*English headers; Chinese notes welcome.*

---

## ACCOUNTS & ENROLLMENT

### Apple Developer Program
- [ ] Enroll in Apple Developer Program ($99/yr)
- [ ] Verify email address
- [ ] Complete legal agreements (Individual or Organization)
- [ ] Add payment method
- [ ] Note: Developer account must match app signature

**中文备注：** 必须使用真实身份信息；如果是组织，需要确认关联账户。

### Google Play Developer Account
- [ ] Enroll in Google Play Console ($25 one-time fee)
- [ ] Verify identity (phone + payment method)
- [ ] Add payment method for potential in-app purchases (if any)
- [ ] Note: Currently no in-app purchases, but account setup required

**中文备注：** 付款方式用于验证和将来如果需要出售功能时使用。

---

## VISUAL ASSETS

### iOS App Icon
- [ ] **Icon file:** 1024 × 1024 pixels, PNG format
- [ ] **Requirements:**
  - No alpha channel (solid background)
  - RGB color space
  - No rounded corners (iOS will apply them)
  - Keep safe zone within 960 × 960 pixels (margins matter)
- [ ] **File location:** App Icon set in Xcode, or App Store Connect upload

**中文备注：** 1024x1024图标必须是不透明的完整正方形；App Store 会自动处理圆角。

### Android App Icon
- [ ] **Foreground:** 108 × 108 pixels (PNG, transparent background allowed)
  - Safe zone: center 72 × 72 pixels
  - Full bleed: 108 × 108 pixels (includes 18px safe margin on all sides)
- [ ] **Background:** 108 × 108 pixels (solid color or pattern, no transparency)
- [ ] **512 × 512 shortcut icon:** High-resolution variant (if app uses shortcuts)

**中文备注：** Android 自适应图标由前景和背景组成；前景应该使用透明背景；512x512用作应用列表中的高分辨率显示。

### Screenshots (iOS)

**iPhone 6.7" (Pro Max) — Required**
- [ ] Dimensions: 1290 × 2796 pixels
- [ ] Format: PNG or JPEG
- [ ] Required: Minimum 2 screenshots
- [ ] Recommended: 5–8 screenshots showing key flows
- [ ] Do: Show actual app UI; include text overlays explaining features
- [ ] Don't: Use mockups or device frames

**iPhone 6.5" (or fallback to 6.1")**
- [ ] Dimensions: 1284 × 2778 pixels (or 1242 × 2688 for 6.1")
- [ ] Optional (can reuse 6.7" set if aspect ratio close)

**iPad 12.9" (optional)**
- [ ] Dimensions: 2048 × 2732 pixels
- [ ] Optional but recommended if app supports landscape

**Screenshot Content Guidelines:**
- Frame 1: Hero shot—show a wish card in full moon mode with the illustration
- Frame 2: Wish Galaxy map view
- Frame 3: Life River view with multiple wishes
- Frame 4: Daily gentle panel feature
- Frame 5: Settings → Delete Account (showing privacy feature)
- Text overlays: Use clear, benefit-focused captions

**中文备注：** 每张截图应该清晰展示应用的核心功能；字幕文本应该用简洁的语言解释该功能为用户提供了什么。

### Screenshots (Android / Google Play)

**Phone Screenshots**
- [ ] **Minimum:** 2 required; **Recommended:** 3–8
- [ ] **Dimensions:** 
  - Min phone width: 320px, max 512px
  - Min phone height: 426px, max 1024px
  - Recommended safe: 1080 × 1920px (for modern phones)
- [ ] Format: PNG or JPEG
- [ ] Content: Same as iOS (wish cards, maps, privacy settings)

**Tablet Screenshots (optional but recommended)**
- [ ] **7" tablet:** 600 × 1024 pixels
- [ ] **10" tablet:** 1280 × 1920 pixels

**Feature Graphic (required for Google Play)**
- [ ] Dimensions: 1024 × 500 pixels
- [ ] Format: PNG or JPEG
- [ ] Content: Eye-catching hero image
  - Example: Wish Galaxy star map with app branding
  - Include app name and tagline overlay
  - Use brand colors (warm paper white + wish purple)
  - No text beyond app name (text on store page is separate)
- [ ] Note: Appears at top of Play Store listing

**中文备注：** 功能图形是 Google Play 页面中最突出的视觉元素；应该吸引眼球、展示应用核心概念。

---

## APPLE APP STORE: METADATA & COMPLIANCE

### App Privacy Label (Required)

The app declares:

**Data Collected:**
- [ ] **Email address**
  - Purpose: Account authentication & recovery
  - Linked to user identity: **Yes**
  - Used for tracking: **No**

- [ ] **User content (wishes, fragments, notes)**
  - Purpose: Core app functionality
  - Linked to user identity: **Yes** (when account synced; **No** if local-only)
  - Used for tracking: **No**

**Service Disclosures (Functionality):**
- [ ] **Wish illustration generation**
  - "Wish text is sent to Anthropic API for AI-powered image generation"
  - Note: This is *not* third-party data sharing; it's disclosed as app functionality
  - Anthropic's privacy policy: [link to Anthropic privacy policy]

**Third-Party Analytics/SDKs:**
- [ ] None used
- [ ] Confirm in App Store Connect: "Does your app use third-party SDKs?" → **No**

**Data Deletion:**
- [ ] Account deletion in-app: **Yes, implemented**
  - Path: Settings → Delete Account
  - Behavior: Deletes all user data; confirms via modal
  - Server: If cloud sync enabled, also deletes remote backups
  - Response time: Immediate

**中文备注：** Apple 隐私标签是强制的，必须准确反映应用的实际数据收集行为。"愿望插图生成"被列为应用功能，而不是第三方数据共享。

### Content Rating Questionnaire

- [ ] **Violence:** None
- [ ] **Sexual Content:** None
- [ ] **Gambling:** None
- [ ] **Alcohol/Tobacco/Drug References:** None
- [ ] **Scary/Threatening:** None
- [ ] **Prolonged Graphic Violence:** N/A
- [ ] **Offensive Language:** None
- [ ] **Profanity:** Unlikely (wellness app)

**Expected Rating:** 4+ (General Audiences)  
*Exact rating depends on Apple's review; wellness apps typically 4+.*

**中文备注：** 应用是健康/个人成长类别，不包含任何受限内容，应该获得最宽松的评级。

### App Review Notes (for Apple Reviewer)

Provide clear, actionable guidance for reviewers:

```
=== WISHFLOW APP REVIEW NOTES ===

## Demo Account (Optional but Helpful)

Test Account:
- Email: demo@wishflow.test
- Password: [if applicable; optional]
- Pre-populated wishes for quick exploration

Demo Wishes Included:
- "Learn to dance" (moon phase: half moon, illustration of figures dancing)
- "Write a novel" (moon phase: full moon)
- "Travel to Iceland" (moon phase: moonrise)

Note: Reviewer can also create a new account or use app fully without account in offline mode.

## Key Features to Test

1. **Offline Usage**
   - App works fully without account
   - Create wishes, view maps, all features accessible
   - No sync unless user creates account

2. **Wish Illustration Generation**
   - Tap "Create Wish"
   - Enter wish text (e.g., "Learn to dance")
   - App calls Anthropic API → illustration generates in 2–5 seconds
   - Single-line drawing style, hand-drawn aesthetic
   - Illustration is displayed on wish card

3. **Moon Phase Connection Levels**
   - Tap wish card → Three buttons labeled:
     - 🌑 Moonrise (2 min)
     - 🌒 Half Moon (15 min)
     - 🌕 Full Moon (60 min)
   - Each logs a connection; counter visible on wish card
   - No reminders, no pressure to hit targets

4. **Data Visualization Maps**
   - Wish Galaxy: Star map view of all wishes
   - Life River: Wishes flowing through life stages (13–18, 18–25, etc.)
   - Both views accessible from main tab bar

5. **Account & Deletion**
   - Settings → Delete Account
   - Confirms user intent with modal
   - Deletes all wishes, fragments, data
   - If account had cloud sync, remote data also deleted
   - Process is immediate; no email verification loop

6. **Privacy: No Analytics or Tracking**
   - No third-party analytics SDKs
   - No event tracking, no user profiling
   - No ads, no data sales

## Known Behaviors

- **First Launch:** Empty state UI guides user to create first wish
- **Offline vs. Online:** Local storage by default; optional account for sync
- **AI Generation:** Requires internet for wish illustration; otherwise app fully offline
- **Data Persistence:** If user doesn't delete account, wishes remain indefinitely

## Contact

For questions: cqyestateyuki@gmail.com

=== END NOTES ===
```

**中文备注：** 清晰的测试说明能加快审核速度；包括演示账户、关键功能测试路径和已知行为说明。

### Compliance: In-App Account Deletion (5.1.1(v))

✅ **Requirement:** Apps with account creation must allow in-app deletion.

- [ ] Deletion UI in Settings
- [ ] Single clear action (not buried)
- [ ] Confirmation modal (prevents accidental deletion)
- [ ] All associated data deleted
- [ ] Visible to reviewers; test path provided in review notes

**Implementation Checklist:**
- [ ] Settings screen has "Delete Account" button (or menu item)
- [ ] Tapping → confirmation modal
- [ ] Modal text: "Are you sure? This will delete all your wishes and data forever. This cannot be undone."
- [ ] CTA buttons: "Delete Everything" (red/destructive) + "Cancel"
- [ ] On confirmation: Delete local data + remote data (if synced)
- [ ] Post-deletion: Return to onboarding / login screen

**中文备注：** Apple 5.1.1(v) 是强制性的；删除账户的流程必须是直观的、易于执行的，不能隐藏在菜单深处。

---

## GOOGLE PLAY: METADATA & COMPLIANCE

### Data Safety Form

Complete on Google Play Console under **Data Safety > Manage** section:

#### 1. Data Collection & Security

- [ ] **Data types collected:**
  - Personal info: Email address (linked to identity)
  - User-generated content: Wishes, fragments, notes (linked to identity)
  
- [ ] **Encryption in transit:** Yes (HTTPS)
- [ ] **Encryption at rest:** Yes (local device storage + remote backups encrypted)
- [ ] **Data retention:** User-controlled; deleted on account deletion
- [ ] **Third-party sharing:** None

#### 2. Security Practices

- [ ] Data encrypted in transit (TLS/HTTPS)
- [ ] Committed to security best practices
- [ ] Regular security reviews
- [ ] No known vulnerabilities (at time of submission)

#### 3. Restricted Access

- [ ] Access limited to essential staff
- [ ] No third-party analytics companies
- [ ] No marketing/ad networks
- [ ] No data brokers

**中文备注：** Google Play 要求应用声明其数据实践；必须准确描述数据如何存储、如何删除、谁可以访问。

### Content Rating (Google Play)

Same as Apple—use Google Play's questionnaire:

- [ ] Rating Category: **Content Rating: Unrated / Everyone** (or equivalent)
- [ ] Declare no sensitive content (violence, sex, profanity, etc.)
- [ ] Expected rating: Everyone / 4+ analog

**中文备注：** Google Play 使用国际电影分级制度的变体；应用应该被列为"所有人"或最宽松的类别。

### Store Listing Compliance

- [ ] **Promotional text & description:** No misleading claims
- [ ] **Screenshots:** Accurate; no photoshopped/fake content
- [ ] **Keywords:** Relevant; no spam keywords
- [ ] **Contact info:** Email provided (cqyestateyuki@gmail.com)
- [ ] **App category:** Health & Fitness or Lifestyle (Wishflow bridges both)
- [ ] **Content rating:** Declared accurately

---

## LEGAL & PRIVACY

### Privacy Policy & Terms of Service

- [ ] Privacy Policy live at: **https://wishflow-ruddy.vercel.app/privacy**
  - [ ] Address: Privacy policy must cover email, wish data, AI API calls, local storage, cloud sync (if offered), and deletion process
  - [ ] Language: English (primary); note Chinese translation available if required by store
  - [ ] Accuracy: Matches app's actual data practices
  
- [ ] Terms of Service live at: **https://wishflow-ruddy.vercel.app/terms**
  - [ ] Covers user responsibilities, account deletion, API usage, prohibited uses
  - [ ] Age requirement (13+) stated clearly
  
- [ ] Both URLs work and are accessible
- [ ] Both pages are mobile-friendly
- [ ] Both pages load within 3 seconds

**中文备注：** 隐私政策必须准确描述应用如何收集、使用、存储和删除用户数据。任何向第三方发送数据（如 Anthropic API 以生成插图）的行为都必须在隐私政策中披露。

### GDPR & Data Protection (if applicable)

- [ ] Privacy policy complies with GDPR (if serving EU users)
- [ ] Data deletion works as promised (legal requirement)
- [ ] Consent for non-essential processing (optional cloud sync): Explicit opt-in
- [ ] Data processing agreement with Anthropic (for API calls) documented

---

## EXPORT COMPLIANCE

### Technology / Encryption Declaration

**Wishflow uses:**
- [ ] HTTPS/TLS for all network communication (standard encryption)
- [ ] Local encryption on device (standard iOS/Android keychain)

**Declaration for U.S. Export Control:**
- [ ] App uses only **standard encryption (AES, TLS/HTTPS)**
- [ ] No custom cryptographic algorithms
- [ ] Eligible for **ENC Encryption Items (Goods)** exemption
- [ ] **Conclusion:** Export control **NOT REQUIRED**

**Apple Form to Complete:**
- [ ] App Store Connect → App Information → Encryption Key Opt-out
- [ ] Question: "Does your app use encryption?" → **Yes, but standard only**
- [ ] Apple will classify as exempt

**Google Play:**
- [ ] No specific export compliance form needed (standard HTTPS assumed safe)
- [ ] If asked: "Standard HTTPS encryption for API communication and cloud sync"

**中文备注：** 标准 HTTPS 加密不需要特别的出口合规审查；自定义加密算法才需要。

---

## FINAL CHECKLIST

### Before Submission (General)

- [ ] App tested on iOS (minimum iOS 14 or as specified)
- [ ] App tested on Android (minimum Android 10 or as specified)
- [ ] All links in app work (privacy policy, terms, contact email)
- [ ] No test accounts / credentials left in app
- [ ] No debug logs / console output
- [ ] Wish illustration generation API key not hardcoded; uses secure config
- [ ] Offline functionality verified (app works without network)
- [ ] Account creation flow verified
- [ ] Account deletion flow verified (tested end-to-end)

### Before Apple Submission

- [ ] App icon uploaded (1024 × 1024, no alpha)
- [ ] Screenshots uploaded (at least 2; iOS 6.7" or largest size)
- [ ] Promotional text filled in (≤170 chars)
- [ ] Description filled in (~2000–3000 chars)
- [ ] Keywords filled in (≤100 chars, no spaces after commas)
- [ ] Privacy label completed & accurate
- [ ] Content rating questionnaire completed
- [ ] Review notes provided (including demo account if available)
- [ ] Privacy policy URL working & accurate
- [ ] Terms URL working & accurate
- [ ] Contact email verified (cqyestateyuki@gmail.com)
- [ ] Price: Free (no in-app purchases)
- [ ] Age rating: 4+ (or as determined)
- [ ] Category: Health & Fitness or Lifestyle
- [ ] App is signed with correct provisioning profile

**中文备注：** 在提交给 Apple 前，确保所有元数据都已完善，包括隐私标签、内容评级和完整的应用描述。

### Before Google Play Submission

- [ ] All Android assets uploaded:
  - [ ] App icon (adaptive icon: foreground 108×108 + background 108×108)
  - [ ] 512×512 icon
  - [ ] Screenshots (min 2; recommended 5–8)
  - [ ] Feature graphic (1024×500)
- [ ] Short description (≤80 chars)
- [ ] Full description (~2500 chars)
- [ ] Keywords filled in
- [ ] Data Safety form completed & submitted
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL provided & working
- [ ] Contact email verified (cqyestateyuki@gmail.com)
- [ ] App category: Health & Fitness or Lifestyle
- [ ] Content rating: Unrated / Everyone
- [ ] Price: Free
- [ ] APK/AAB uploaded & tested
- [ ] Build signed with release key (not debug)

**中文备注：** Google Play 要求数据安全表单提交；这是强制性的，不能跳过。

---

## POST-LAUNCH MONITORING

- [ ] Monitor app reviews on both stores
- [ ] Respond to user feedback & bug reports within 24–48 hours
- [ ] Track crash reports (Firebase Crashlytics or equivalent)
- [ ] Plan updates for bugs / feature requests
- [ ] Keep privacy policy & terms updated if data practices change
- [ ] Monitor Anthropic API status (in case of wish illustration generation issues)

---

## SUPPORT & CONTACT

**App Support Email:** cqyestateyuki@gmail.com

**Privacy Policy:** https://wishflow-ruddy.vercel.app/privacy  
**Terms of Service:** https://wishflow-ruddy.vercel.app/terms

---

## Version History

| Version | Date       | Notes |
|---------|------------|-------|
| 1.0     | 2026-07-03 | Initial submission checklist created |

---

**Last Updated:** July 3, 2026  
**Prepared for:** Wishflow (愿航) — Gentle Wish Keeper App
