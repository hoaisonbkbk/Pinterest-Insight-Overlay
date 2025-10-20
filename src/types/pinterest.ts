export interface PinterestPin {
    resource_response: ResourceResponse
}

export interface ResourceResponse {
    status: string
    code: number
    message: string
    endpoint_name: string
    data: Data
    x_pinterest_sli_endpoint_name: string
    http_status: number
}

export interface Data {
    video_status_message: any
    videos: any
    can_delete_did_it_and_comments: boolean
    native_creator: any
    reaction_counts: ReactionCounts
    pin_additional_note: any
    promoter: any
    should_open_in_stream: boolean
    image_medium_url: string
    embed: any
    ships_to_user_country: boolean
    rich_summary: RichSummary
    closeup_user_note: string
    is_stale_product: boolean
    creator_class_instance: any
    video_status: any
    is_eligible_for_aggregated_comments: boolean
    buyable_product_availability: any
    access: any[]
    is_native: boolean
    shuffle_asset: any
    is_eligible_for_pdp: boolean
    price_currency: string
    domain: string
    type: string
    is_video: boolean
    rich_metadata: RichMetadata
    link_utm_applicable_and_replaced: number
    product_metadata: ProductMetadata
    share_count: number
    attribution: any
    affiliate_link: any
    comments_disabled: boolean
    description: string
    grid_title: string
    images: Images
    price_value: number
    story_pin_data_id: any
    done_by_me: boolean
    tracking_params: string
    story_pin_data: any
    is_go_linkless: boolean
    is_quick_promotable: boolean
    media_attribution: any
    link_domain: LinkDomain
    unified_user_note: string
    closeup_attribution: CloseupAttribution
    created_at: string
    did_it_disabled: boolean
    is_whitelisted_for_tried_it: boolean
    origin_pinner: any
    closeup_unified_attribution: CloseupUnifiedAttribution
    digital_media_source_type: any
    is_eligible_for_related_products: boolean
    pinned_to_board: any
    product_pin_data: any
    pinner: Pinner
    tracked_link: string
    promoted_is_removable: boolean
    id: string
    is_eligible_for_brand_catalog: boolean
    title: string
    section: any
    hashtags: any[]
    closeup_unified_description: string
    is_quick_promotable_by_pinner: boolean
    description_links: any[]
    creator_analytics: any
    method: string
    mobile_link: any
    sponsorship: any
    edited_fields: string[]
    link: string
    via_pinner: any
    repin_count: number
    has_required_attribution_provider: boolean
    seo_title: string
    is_promotable: boolean
    image_signature: string
    is_promoted: boolean
    is_product_tagging_enabled_standard_pin: boolean
    comment_count: number
    user_mention_tags: any
    is_playable: boolean
    is_hidden: boolean
    closeup_description: string
    is_unsafe_for_comments: boolean
    carousel_data: any
    creator_class: any
    highlighted_aggregated_comments: any[]
    shuffle: any
    manual_interest_tags: any
    privacy: string
    visual_objects: VisualObject[]
    shopping_flags: number[]
    category: string
    shopping_rec_disabled: boolean
    board: Board
    is_repin: boolean
    alt_text: any
    description_html: string
    third_party_pin_owner: any
    is_oos_product: boolean
    aggregated_pin_data: AggregatedPinData
    utm_link: any
    collection_pin: any
}



export interface ReactionCounts {
    "1": number
}

export interface RichSummary {
    actions: any[]
    display_description: string
    url: string
    aggregate_rating: AggregateRating
    type: string
    type_name: string
    favicon_images: FaviconImages
    site_name: string
    products: Product[]
    apple_touch_icon_images: any
    id: string
    favicon_link: string
    apple_touch_icon_link: any
    display_name: string
}

export interface AggregateRating {
    review_count: number
    rating_distribution: any[]
    id: string
    type: string
    rating_count: number
    name: any
}

export interface FaviconImages {
    orig: string
}

export interface Product {
    purchase_url: any
    variant_set: any
    label_info: LabelInfo
    type: string
    has_multi_images: boolean
    videos: any[]
    name: string
    offers: Offer[]
    shipping_info: ShippingInfo
    id: string
    additional_images: any
    additional_images_per_spec: any
    item_set_id: string
    price_history_summary: PriceHistorySummary
    offer_summary: OfferSummary
    item_id: string
}

export interface LabelInfo { }

export interface Offer {
    price_value: number
    availability: number
    id: string
    in_stock: boolean
    type: string
    min_ad_price: any
    price_currency: string
    condition: number
    name: any
}

export interface ShippingInfo { }

export interface PriceHistorySummary { }

export interface OfferSummary {
    price_val: number
    currency: string
    price: string
    in_stock: boolean
    availability: number
    condition: number
    standard_price: string
    percentage_off: string
}

export interface RichMetadata {
    amp_valid: boolean
    url: string
    aggregate_rating: AggregateRating2
    type: string
    tracker: any
    favicon_images: FaviconImages2
    products: Product2[]
    apple_touch_icon_images: any
    canonical_url: any
    id: string
    title: string
    has_price_drop: boolean
    aggregated_app_link: AggregatedAppLink
    apple_touch_icon_link: any
    description: string
    amp_url: string
    site_name: string
    locale: string
    favicon_link: string
    link_status: number
}

export interface AggregateRating2 {
    review_count: number
    rating_distribution: any[]
    id: string
    type: string
    rating_count: number
    name: any
}

export interface FaviconImages2 {
    orig: string
}

export interface Product2 {
    purchase_url: any
    variant_set: any
    label_info: LabelInfo2
    type: string
    has_multi_images: boolean
    videos: any[]
    name: string
    offers: any[]
    shipping_info: ShippingInfo2
    id: string
    additional_images: AdditionalImage[]
    additional_images_per_spec: AdditionalImagesPerSpec
    item_set_id: string
    price_history_summary: PriceHistorySummary2
    offer_summary: OfferSummary2
    item_id: string
}

export interface LabelInfo2 { }

export interface ShippingInfo2 { }

export interface AdditionalImage {
    image_signature: string
    canonical_images: CanonicalImages
}

export interface CanonicalImages {
    "736x": N736x
}

export interface N736x {
    width: number
    height: number
    url: string
}

export interface AdditionalImagesPerSpec {
    "736x": N736x2[]
}

export interface N736x2 {
    image_signature: string
    canonical_image: CanonicalImage
}

export interface CanonicalImage {
    width: number
    height: number
    url: string
}

export interface PriceHistorySummary2 { }

export interface OfferSummary2 {
    price_val: number
    currency: string
    price: string
    in_stock: boolean
    availability: number
    condition: number
    standard_price: string
    percentage_off: string
}

export interface AggregatedAppLink {
    android: Android
    iphone: Iphone
    ios: Ios
    ipad: Ipad
}

export interface Android {
    app_url: string
    app_id: string
    app_name: string
}

export interface Iphone {
    app_url: string
    app_id: string
    app_name: string
}

export interface Ios {
    app_url: string
    app_id: string
    app_name: string
}

export interface Ipad {
    app_url: string
    app_id: string
    app_name: string
}

export interface ProductMetadata {
    type: string
    id: string
}

export interface Images {
    "60x60": N60x60
    "136x136": N136x136
    "170x": N170x
    "236x": N236x
    "474x": N474x
    "564x": N564x
    "736x": N736x3
    "600x315": N600x315
    orig: Orig
}

export interface N60x60 {
    width: number
    height: number
    url: string
}

export interface N136x136 {
    width: number
    height: number
    url: string
}

export interface N170x {
    width: number
    height: number
    url: string
}

export interface N236x {
    width: number
    height: number
    url: string
}

export interface N474x {
    width: number
    height: number
    url: string
}

export interface N564x {
    width: number
    height: number
    url: string
}

export interface N736x3 {
    width: number
    height: number
    url: string
}

export interface N600x315 {
    width: number
    height: number
    url: string
}

export interface Orig {
    width: number
    height: number
    url: string
}

export interface LinkDomain {
    id: string
}

export interface CloseupAttribution {
    node_id: string
    followed_by_me: boolean
    is_default_image: boolean
    type: string
    first_name: string
    id: string
    image_small_url: string
    image_medium_url: string
    domain_verified: boolean
    is_ads_only_profile: boolean
    domain_url: string
    full_name: string
    indexed: boolean
    is_verified_merchant: boolean
    follower_count: number
    blocked_by_me: boolean
    ads_only_profile_site: any
    username: string
    explicitly_followed_by_me: boolean
    verified_identity: VerifiedIdentity
}

export interface VerifiedIdentity {
    name: string
    verified: boolean
}

export interface CloseupUnifiedAttribution {
    node_id: string
    followed_by_me: boolean
    is_default_image: boolean
    type: string
    first_name: string
    id: string
    image_small_url: string
    image_medium_url: string
    domain_verified: boolean
    is_ads_only_profile: boolean
    domain_url: string
    full_name: string
    indexed: boolean
    is_verified_merchant: boolean
    follower_count: number
    blocked_by_me: boolean
    ads_only_profile_site: any
    username: string
    explicitly_followed_by_me: boolean
    verified_identity: VerifiedIdentity2
}

export interface VerifiedIdentity2 {
    name: string
    verified: boolean
}

export interface Pinner {
    node_id: string
    followed_by_me: boolean
    is_default_image: boolean
    type: string
    first_name: string
    id: string
    image_small_url: string
    image_medium_url: string
    domain_verified: boolean
    is_ads_only_profile: boolean
    domain_url: any
    full_name: string
    indexed: boolean
    is_verified_merchant: boolean
    follower_count: number
    blocked_by_me: boolean
    ads_only_profile_site: any
    username: string
    explicitly_followed_by_me: boolean
    verified_identity: VerifiedIdentity3
}

export interface VerifiedIdentity3 { }

export interface VisualObject {
    x: number
    y: number
    w: number
    h: number
    detection: boolean
    score: number
    label?: string
    title?: string
    label_id?: number
    index?: number
    is_stela?: boolean
    label_x?: number
    label_y?: number
}

export interface Board {
    node_id: string
    followed_by_me: boolean
    url: string
    type: string
    image_thumbnail_url: string
    pin_thumbnail_urls: string[]
    id: string
    description: string
    is_collaborative: boolean
    map_id: string
    privacy: string
    owner: Owner
    layout: string
    name: string
    category: any
    access: any[]
    is_ads_only: boolean
    image_cover_url: string
    collaborated_by_me: boolean
}

export interface Owner {
    node_id: string
    followed_by_me: boolean
    is_default_image: boolean
    type: string
    first_name: string
    id: string
    image_small_url: string
    image_medium_url: string
    domain_verified: boolean
    is_ads_only_profile: boolean
    domain_url: any
    full_name: string
    indexed: boolean
    is_verified_merchant: boolean
    follower_count: number
    blocked_by_me: boolean
    ads_only_profile_site: any
    username: string
    explicitly_followed_by_me: boolean
    verified_identity: VerifiedIdentity4
}

export interface VerifiedIdentity4 { }

export interface AggregatedPinData {
    node_id: string
    id: string
    comment_count: number
    is_stela: boolean
    did_it_data: DidItData
    creator_analytics: any
    is_shop_the_look: boolean
    aggregated_stats: AggregatedStats
}

export interface DidItData {
    recommended_count: number
    tags: any[]
    recommend_scores: RecommendScore[]
    videos_count: number
    details_count: number
    type: string
    user_count: number
    rating: number
    responses_count: number
    images_count: number
}

export interface RecommendScore {
    score: number
    count: number
}

export interface AggregatedStats {
    saves: number
    done: number
}


export interface Advertiser {
    id: string
    owner_user_id: string
    name: string
    country: number
    currency: number
    currency_code: string
    created_time: number
    accepted_tos: number[]
    merchant_id: string
    has_valid_billing_profile: boolean
    has_business_address: any
    status: string
    segment_metadata: SegmentMetadata
    integration_platforms: string[]
    client_business_id: any
    targeting_rmn_business_id: any
    reseller_user_id: any
    time_zone: any
    is_impersonation: boolean
    inactive_advertisers: any[]
    actions: number[]
    is_sterling_prod: boolean
    ad_groups_enabled: boolean
    bulk_v2_shopping_enabled: boolean
    shopping_retargeting_eligibility: boolean
    ocpm_conversion_window_enabled: boolean
    offline_conversion_ga_enabled: boolean
    modeled_conversion_reporting_enabled: boolean
    shopify_organic_attribution_enabled: boolean
    enable_shopping_reporting: boolean
    is_story_ads_sponsor_allowed: boolean
    is_story_ads_standalone_allowed: boolean
    bulk_v4_disabled: boolean
}

export interface SegmentMetadata {
    pod: string
    msc_across_family: string
    pod_channel: string
    sales_channel: string
    pod_sector: string
    monthly_spend_cohort: string
    sales_team: string
    is_managed: string
}

export interface AnalysisUa {
    app_type: number
    app_version: string
    browser_name: string
    browser_version: string
    device_type: any
    device: string
    os_name: string
    os_version: string
}

export interface User {
    node_id: string
    custom_gender: any
    domain_verified: boolean
    gender: string
    username: string
    age_in_years: number
    facebook_id: string
    connected_to_instagram: boolean
    is_under_16: boolean
    resurrection_info: any
    is_ads_only_profile: boolean
    unverified_phone_number_without_country: string
    has_password: boolean
    last_name: string
    unverified_phone_country: any
    show_personal_boutique: boolean
    image_medium_url: string
    profile_discovered_public: boolean
    is_write_banned: boolean
    connected_to_etsy: boolean
    epik: string
    teen_safety_options_url: any
    is_parental_control_passcode_enabled: boolean
    allow_analytic_cookies: any
    is_eligible_for_image_only_grid: boolean
    verified_identity: VerifiedIdentity5
    verified_domains: string[]
    weight_loss_ads_opted_out: boolean
    is_under_18: boolean
    id: string
    should_show_messaging: boolean
    website_url: string
    opt_in_private_account: boolean
    twitter_url: any
    created_at: string
    type: string
    has_mfa_enabled: boolean
    search_privacy_enabled: boolean
    is_parental_control_passcode_verification_pending: boolean
    connected_to_youtube: boolean
    connected_to_dropbox: boolean
    can_edit_search_privacy: boolean
    image_xlarge_url: string
    personalize_from_offsite_browsing: boolean
    phone_number: any
    connected_to_microsoft: boolean
    has_quicksave_board: boolean
    facebook_timeline_enabled: boolean
    listed_website_url: any
    phone_country: any
    is_high_risk: boolean
    twitter_publish_enabled: boolean
    ip_region: string
    domain_url: string
    exclude_from_search: boolean
    connected_to_google: boolean
    unverified_phone_number: any
    email: string
    allow_switch_between_private_and_public_profile: boolean
    verified_user_websites: string[]
    is_private_profile: boolean
    push_package_user_id: string
    partner: Partner
    allow_personalization_cookies: any
    nags: any[]
    country: string
    can_enable_mfa: boolean
    is_partner: boolean
    gplus_url: string
    image_small_url: string
    is_any_website_verified: boolean
    login_state: number
    ads_only_profile_site: any
    first_name: string
    is_matured_new_user: boolean
    is_candidate_for_parental_control_passcode: boolean
    facebook_publish_stream_enabled: boolean
    phone_number_end: string
    connected_to_facebook: boolean
    third_party_marketing_tracking_enabled: boolean
    parental_control_anonymized_email: any
    image_large_url: string
    full_name: string
    ip_country: string
    allow_marketing_cookies: any
}

export interface VerifiedIdentity5 { }

export interface Partner {
    node_id: string
    is_create: boolean
    merchant_segmentation_rich_pin_count: number
    daily_ads_budget: string
    top_business_goal: string
    marketing_plan_name: string
    agency_services_other: any
    contact_name: string
    is_agency_employee: any
    contact_email: string
    id: string
    business_vertical_other: any
    biz_ownership_status: any
    is_linked_business: boolean
    enable_profile_message: boolean
    selected_ecommerce_platforms: any[]
    merchant_segmentation_feed_pin_count: number
    created_at: string
    profile_place: ProfilePlace
    number_employees: any
    contact_phone: string
    type: string
    is_business_agency: any
    third_party_apps: any[]
    is_shopify_installed: boolean
    account_type: string
    auto_follow_allowed: boolean
    number_agency_clients: any
    business_vertical: any
    business_goals: string[]
    agency_services: any
    advertising_intent: number
    agency_content: any
    enable_profile_address: boolean
    profile_place_id: number
    contact_details: ContactDetails
    merchant_segmentation_checkout_size: number
    biz_ownership_email: any
    business_name: string
    merchant_segmentation_is_golden: boolean
    merchant_center_join_vmp_status: number
    contact_phone_country: ContactPhoneCountry
    is_convert: boolean
    custom_daily_ads_budget: number
}

export interface ProfilePlace {
    id: string
}

export interface ContactDetails {
    email: string
    phone_country: string
    phone_number: string
}

export interface ContactPhoneCountry {
    code: string
    phone_code: string
}

export interface Options {
    bookmarks: string[]
    id: string
    field_set_key: string
    fetch_visual_search_objects: boolean
}
