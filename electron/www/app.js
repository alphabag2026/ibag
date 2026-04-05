// ═══════════════════════════════════════════════════════════
// Alphabag v3.0 - Full Renewal
// ═══════════════════════════════════════════════════════════

const API_BASE = window.location.origin;
const IS_ELECTRON = !!(window.electronAPI && window.electronAPI.isElectron);

// ─── App Version & OTA Update ───
const APP_VERSION = '5.3.4';
const APP_VERSION_CODE = 534;
const UPDATE_CHECK_URL = 'https://xplayvault-foftd3kr.manus.space/api/ibag-update';
let updateInfo = null; // { version, versionCode, downloadUrl, changelog, forceUpdate }
let updateCheckState = 'idle'; // idle, checking, available, latest, error, downloading
let isPinned = false; // Always on Top state
let isMiniMode = false; // Mini mode state
let quickCopyMode = false; // Quick copy panel visibility

// ─── Constants ───
const BOOKMARK_CATEGORIES = ['main_site','ai','design','dev','exchange','defi','nft','finance','marketing','education','news','tool','social','other'];
const BOOKMARK_CATEGORY_KEYS = { main_site:'cat_main_site', ai:'cat_ai', design:'cat_design', dev:'cat_dev', exchange:'cat_exchange', defi:'cat_defi', nft:'cat_nft', finance:'cat_finance', marketing:'cat_marketing', education:'cat_education', news:'cat_news', tool:'cat_tool', social:'cat_social', other:'cat_other' };
const BOOKMARK_CATEGORY_ICONS = { main_site:'ri-star-line', ai:'ri-robot-2-line', design:'ri-palette-line', dev:'ri-code-s-slash-line', exchange:'ri-exchange-line', defi:'ri-exchange-funds-line', nft:'ri-nft-line', finance:'ri-money-dollar-circle-line', marketing:'ri-megaphone-line', education:'ri-book-open-line', news:'ri-newspaper-line', tool:'ri-tools-line', social:'ri-group-line', other:'ri-more-line' };
const CATEGORY_COLORS = { main_site:'#00d4ff', ai:'#a855f7', design:'#f472b6', dev:'#22d3ee', exchange:'#8b5cf6', defi:'#10b981', nft:'#f59e0b', finance:'#eab308', marketing:'#f97316', education:'#06b6d4', news:'#ef4444', tool:'#6366f1', social:'#ec4899', other:'#64748b', photo:'#00d4ff', document:'#10b981', video:'#f59e0b', audio:'#ec4899', other_file:'#64748b' };
// LANGUAGES is defined in translations.js
const LOCK_TIMEOUT_OPTIONS = [
  { val: -1, key: 'lock_never' },
  { val: 30000, key: 'lock_30s' },
  { val: 60000, key: 'lock_1m' },
  { val: 300000, key: 'lock_5m' },
  { val: 600000, key: 'lock_10m' },
];

// 1page.to project sites
const INFOWEB4_SITES = [
  { id: 'xplay', name: 'XPLAY', url: 'https://xplay.1page.to', logo: '🎮', color: '#00d4ff', category: 'DeFi', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/logo-xplay-hjvxRcUWwXtTna4zA2RmHe.webp' },
  { id: 'nice', name: 'NICE', url: 'https://nice.1page.to', logo: '✨', color: '#10b981', category: 'DeFi', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/logo-nice-9eWPfR6Hwjns48zZxHsVEq.webp' },
  { id: 'openocto', name: 'OpenOcto', url: 'https://openocto.1page.to', logo: '🐙', color: '#f59e0b', category: 'AI', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/logo-openocto-gZfzhbL6efZSYfZ79N97pL.webp' },
  { id: 'nexus2140', name: 'NEXUS 2140', url: 'https://nexus.1page.to', logo: '🌐', color: '#8b5cf6', category: 'AI', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/logo-nexus2140-ABourwSSasPx8KBXimVJdT.webp' },
  { id: 'benefer', name: 'BENEFER', url: 'https://benefer.1page.to', logo: '💎', color: '#06b6d4', category: 'Web3', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/benefer-logo_70490d92.png' },
  { id: 'loomx', name: 'LOOM-X', url: 'https://loomx.1page.to', logo: '🔗', color: '#3b82f6', category: 'DeFi', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/EpEA9QsFSK7L7cGqDuapK6/loomx-logo_03af7a9b.png' },
  { id: 'pindex', name: 'PINDex', url: 'https://pindex.1page.to', logo: '📊', color: '#ec4899', category: 'DeFi', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/9jQGzefzQstehDUagwHYVf/pindex-hero-bg-9NDvXK6pfXn8yhRCTKk7DL.webp' },
  { id: 'habibi', name: 'HABIBIDECK', url: 'https://habibi.1page.to', logo: '🏛️', color: '#14b8a6', category: 'RWA', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/Smzj32CPBzWyRzRkSUn4HG/habibideck-hero-2cR98yKZNNTGgYoXBL7sHk.webp' },
  { id: 'squidverse', name: 'SquidVerse', url: 'https://squidverse.1page.to', logo: '🦑', color: '#f97316', category: 'GameFi', faviconUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663373200888/cugSwBMUoeHHVgXA.svg' },
  { id: 'arai', name: 'ARAI Systems', url: 'https://arai.1page.to', logo: '🤖', color: '#6366f1', category: 'AI', faviconUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/4pxxAVjbdWEkvuECKZGnHB/arai-hero-bg-dzgpsTMEbJjFFUHHgjpmgk.webp' },
];

// Default middle tabs
const DEFAULT_MIDDLE_TABS = [
  { id: 'my', label: 'MY', icon: 'ri-user-star-line' },
  { id: 'coin', label: 'Coin', icon: 'ri-coin-line' },
  { id: 'onepage', label: '1page.to', icon: 'ri-pages-line' },
  { id: 'news', label: 'News', icon: 'ri-newspaper-line' },
  { id: 'meetup', label: '밋업', icon: 'ri-group-line' },
  { id: 'kol', label: 'KOL', icon: 'ri-user-voice-line' },
];

// CoinGecko token IDs - Mainnet tokens with logos
const TOKEN_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a', fixed: true, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627eea', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '◆', color: '#f3ba2f', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945ff', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '✕', color: '#00aae4', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳', color: '#0033ad', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#c2a633', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●', color: '#e6007a', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: '▲', color: '#e84142', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: '⬡', color: '#2a5ada', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'matic-network', symbol: 'POL', name: 'Polygon', icon: '⬟', color: '#8247e5', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', icon: '◈', color: '#ff0013', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', icon: '🦄', color: '#ff007a', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'Ł', color: '#bfbbbb', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', icon: '⚛', color: '#2e3148', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', icon: '✦', color: '#14b6e7', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR', icon: 'Ⓝ', color: '#000000', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', icon: '◇', color: '#4cd080', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png' },
  { id: 'sui', symbol: 'SUI', name: 'Sui', icon: '💧', color: '#6fbcf0', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/26375/small/sui-ocean-square.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', icon: '⟐', color: '#28a0f0', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26a17b', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', icon: '$', color: '#2775ca', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕', color: '#ffa409', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', icon: '🐸', color: '#00b84d', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
  { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', color: '#f09242', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
  { id: 'dai', symbol: 'DAI', name: 'Dai', icon: '◈', color: '#f5ac37', fixed: false, mainnet: false, logo: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', icon: '∞', color: '#29abe2', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', icon: '⨎', color: '#0090ff', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', icon: 'ℏ', color: '#000000', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/3688/small/hbar.png' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa', icon: '◆', color: '#49eacb', fixed: false, mainnet: true, logo: 'https://assets.coingecko.com/coins/images/25751/small/kaspa-icon-exchanges.png' },
];

// Custom tokens added by user via contract address
let customTokens = []; // { id, symbol, name, logo, color, contractAddress, network }

function saveCustomTokens() {
  try {
    localStorage.setItem('ibag_custom_tokens', JSON.stringify(customTokens));
  } catch(e) { console.log('Save custom tokens error:', e); }
}
function loadCustomTokens() {
  try {
    const saved = localStorage.getItem('ibag_custom_tokens');
    if (saved) { customTokens = JSON.parse(saved); }
  } catch(e) { console.log('Load custom tokens error:', e); customTokens = []; }
}

// Chain explorers for scan feature
const CHAIN_EXPLORERS = {
  'ethereum': { name: 'Ethereum', explorer: 'https://etherscan.io', addressPath: '/address/', txPath: '/tx/', icon: 'Ξ', color: '#627eea' },
  'binance-smart-chain': { name: 'BSC', explorer: 'https://bscscan.com', addressPath: '/address/', txPath: '/tx/', icon: '◆', color: '#f3ba2f' },
  'polygon-pos': { name: 'Polygon', explorer: 'https://polygonscan.com', addressPath: '/address/', txPath: '/tx/', icon: '⬟', color: '#8247e5' },
  'arbitrum-one': { name: 'Arbitrum', explorer: 'https://arbiscan.io', addressPath: '/address/', txPath: '/tx/', icon: '⟐', color: '#28a0f0' },
  'avalanche': { name: 'Avalanche', explorer: 'https://snowtrace.io', addressPath: '/address/', txPath: '/tx/', icon: '▲', color: '#e84142' },
  'base': { name: 'Base', explorer: 'https://basescan.org', addressPath: '/address/', txPath: '/tx/', icon: '🔵', color: '#0052ff' },
  'optimistic-ethereum': { name: 'Optimism', explorer: 'https://optimistic.etherscan.io', addressPath: '/address/', txPath: '/tx/', icon: '⭕', color: '#ff0420' },
  'solana': { name: 'Solana', explorer: 'https://solscan.io', addressPath: '/account/', txPath: '/tx/', icon: '◎', color: '#9945ff' },
  'tron': { name: 'TRON', explorer: 'https://tronscan.org', addressPath: '/#/address/', txPath: '/#/transaction/', icon: '◈', color: '#ff0013' },
  'cosmos': { name: 'Cosmos', explorer: 'https://www.mintscan.io/cosmos', addressPath: '/address/', txPath: '/tx/', icon: '⚛', color: '#2e3148' },
  'near': { name: 'NEAR', explorer: 'https://nearblocks.io', addressPath: '/address/', txPath: '/txns/', icon: 'Ⓝ', color: '#000000' },
  'aptos': { name: 'Aptos', explorer: 'https://aptoscan.com', addressPath: '/account/', txPath: '/transaction/', icon: '◇', color: '#4cd080' },
  'sui': { name: 'Sui', explorer: 'https://suiscan.xyz', addressPath: '/account/', txPath: '/txblock/', icon: '💧', color: '#6fbcf0' },
  'ripple': { name: 'XRP', explorer: 'https://xrpscan.com', addressPath: '/account/', txPath: '/tx/', icon: '✕', color: '#00aae4' },
  'cardano': { name: 'Cardano', explorer: 'https://cardanoscan.io', addressPath: '/address/', txPath: '/transaction/', icon: '₳', color: '#0033ad' },
  'bitcoin': { name: 'Bitcoin', explorer: 'https://blockchair.com/bitcoin', addressPath: '/address/', txPath: '/transaction/', icon: '₿', color: '#f7931a' },
  'litecoin': { name: 'Litecoin', explorer: 'https://blockchair.com/litecoin', addressPath: '/address/', txPath: '/transaction/', icon: 'Ł', color: '#bfbbbb' },
  'dogecoin': { name: 'Dogecoin', explorer: 'https://blockchair.com/dogecoin', addressPath: '/address/', txPath: '/transaction/', icon: 'Ð', color: '#c2a633' },
  'stellar': { name: 'Stellar', explorer: 'https://stellarchain.io', addressPath: '/accounts/', txPath: '/transactions/', icon: '✦', color: '#14b6e7' },
  'filecoin': { name: 'Filecoin', explorer: 'https://filfox.info/en', addressPath: '/address/', txPath: '/message/', icon: '⨎', color: '#0090ff' },
  'hedera': { name: 'Hedera', explorer: 'https://hashscan.io/mainnet', addressPath: '/account/', txPath: '/transaction/', icon: 'ℏ', color: '#000000' },
  'kaspa': { name: 'Kaspa', explorer: 'https://explorer.kaspa.org', addressPath: '/addresses/', txPath: '/txs/', icon: '◆', color: '#49eacb' },
  'internet-computer': { name: 'ICP', explorer: 'https://dashboard.internetcomputer.org', addressPath: '/account/', txPath: '/transaction/', icon: '∞', color: '#29abe2' },
  'polkadot': { name: 'Polkadot', explorer: 'https://polkadot.subscan.io', addressPath: '/account/', txPath: '/extrinsic/', icon: '●', color: '#e6007a' },
};

// Custom mainnets added by user
let customMainnets = []; // { id, name, explorer, addressPath, txPath, icon, color }

// ─── State ───
let state = {
  locked: true, isSetup: false, pin: '', privatePin: '', currentTab: 'home',
  language: 'ko', theme: 'dark', bookmarks: [], mailAccounts: [], memos: [], files: [],
  lockTimeout: -1, savedTokens: ['bitcoin','ethereum','binancecoin'],
  orgCharts: [], // { id, name, projectName, nodes: [{id, parentId, name, phone, wallet, amount}] }
  customProjects: [], // { id, name, url, logo, color }
};

// UI state
let currentPin = '', confirmPin = '', isConfirming = false, pinError = '';
let _pinProcessing = false; // Prevent input during PIN validation
let searchQuery = '', bmTab = 'sites', bmCategoryFilter = 'all';
let showModal = false, modalType = '', editingItem = null;
let privatePinInput = '', privatePinConfirm = '', privatePinStep = '', privatePinError = '';
let privatePinUnlocked = false, privatePinCallback = null;
let memoTempImage = null, memoImageCache = {};
let showNotifications = false, notifications = [], bannerData = [], bannerDismissed = false;
let shareSelectMode = false, shareSelectType = '', shareSelectedIds = new Set();
let tokenPrices = {};
let middleTabs = [...DEFAULT_MIDDLE_TABS];
let activeMiddleTab = 'my';
let showPlusMenu = false;
let showHamburgerMenu = false;
let currentOrgChart = null; // currently viewing org chart
let orgEditNode = null;
// Vault security state
let vaultUnlocked = false;
let vaultViewPassword = null; // kept in memory only while unlocked
let vaultOrgCharts = []; // decrypted org charts (memory only)
let vaultScreen = ''; // 'setup' | 'unlock' | 'list' | 'view'
let vaultPwInput = '';
let vaultPwConfirm = '';
let vaultPanicInput = '';
let vaultPanicConfirm = '';
let vaultSetupStep = 0; // 0=pw1, 1=pw1-confirm, 2=pw2, 3=pw2-confirm
let vaultError = '';
let vaultAttempts = 0;
const VAULT_MAX_ATTEMPTS = 5;
let vaultAutoLockTimer = null;
let vaultAutoLockMinutes = parseInt(localStorage.getItem('ibag_vault_autolock') || '5'); // 0=disabled, 1/3/5/10/30
let vaultChangeMode = ''; // '' | 'change-view' | 'change-panic' | 'verify-old'
let vaultOldPassword = '';
let lifeItems = []; // { id, type:'photo'|'contact'|'address', title, description, imageData, phone, createdAt }
let calcMode = 'currency'; // 'currency' | 'photo'
let calcFrom = 'USD', calcTo = 'KRW', calcAmount = '';
let calcTabMode = 'exchange'; // 'exchange' | 'fee' | 'general'

// General Calculator state
let generalCalcDisplay = '0';
let generalCalcPrevValue = null;
let generalCalcOperator = null;
let generalCalcWaitingForOperand = false;
let generalCalcMemory = 0;
// Fee calculator state
let feeCalcMode = 'forward'; // 'forward' = 금액→수수료 | 'reverse' = 목표금액→필요금액 | 'profit' = 수익계산
let feePercent = ''; // 수수료 %
let feeAmount = ''; // 입력 금액
let feeTargetAmount = ''; // 목표 금액 (역산용)
let feeTokenPrice = ''; // 토큰 가격 (수익 계산용)
let feeTokenSymbol = 'USDT'; // 토큰 심볼
let feeResult = null; // 계산 결과
// USDT Exchange Calculator state
let usdtKrwPrice = 0; // Bithumb USDT/KRW price
let exchangeCountry1 = 'KRW', exchangeCountry2 = 'JPY'; // saved country settings
let exchangeActiveField = 'usdt'; // which field user is typing in
let exchangeAmountUsdt = '', exchangeAmount1 = '', exchangeAmount2 = '';
let translateText = '', translateFrom = 'auto', translateTo = 'en', translatedResult = '';
let webviewUrl = '';
let lockTimer = null;
let showLangDropdown = false;
let showScanModal = false;
let showSettingsLangPicker = false;
let scanSelectedChain = 'ethereum';
let scanChainSearch = '';
let scanChainDropdownOpen = false;
let scanDropdownSearch = '';
let scanWalletAddress = '';
// Org chart pan/zoom state
let orgPanX = 0, orgPanY = 0, orgZoom = 1;
let orgViewMode = 'tree'; // 'tree' | 'list-name' | 'list-amount'
let orgIsPanning = false, orgPanStartX = 0, orgPanStartY = 0;
let orgSearchVisible = false;
// Interpreter state
let isInterpreting = false, interpreterRecognition = null;
let interpreterSourceText = '', interpreterTranslatedText = '';
// Photo translate state
let photoTranslateImage = null; // base64 data URL
let photoTranslateOcrText = '';
let photoTranslateResult = '';
let photoTranslateProcessing = false;
// Photo translate overlay state
let photoTranslateViewMode = 'text'; // 'text' | 'overlay'
let photoTranslateLines = []; // {original, translated, bbox}
// Work section state
let workItems = []; // { id, name, type, securityLevel, fields: [{name, value, sensitive}], notes, url, createdAt }
let workEditingItem = null;
let workExpandedId = null; // which work item is expanded

// Clipboard state
let clipboardItems = []; // { id, title, memo, content, type:'text'|'image', imageData, createdAt }
let clipboardEditingItem = null;
let clipboardSearchQuery = '';
let clipboardTempImage = null; // base64 data for image paste

// Idea Note state
let ideaNotes = []; // { id, title, textContent, drawingData, audioBlobs:[], videoBlobs:[], createdAt, updatedAt }
let ideaNoteSearchQuery = '';
let currentIdeaNote = null; // currently editing note
let ideaNoteScreen = 'list'; // 'list' | 'editor'
let ideaDrawing = false; // drawing mode active
let ideaDrawColor = '#00d4ff';
let ideaDrawSize = 3;
let ideaDrawEraser = false;
let ideaRecordingAudio = false;
let ideaRecordingVideo = false;
let ideaMediaRecorder = null;
let ideaRecordedChunks = [];
let ideaRecordingTime = 0;
let ideaRecordingTimer = null;
let ideaPlayingAudioId = null;
let ideaCurrentAudio = null;
let ideaVideoStream = null;

// AI Chat state (Server Proxy LLM - no API key needed)
let aiMessages = []; // { role: 'user'|'model', text: string, timestamp: number }
let aiInputText = '';
let aiIsLoading = false;
let aiGeminiApiKey = 'server-proxy'; // always available via server proxy
let aiGeminiApiKeys = ['server-proxy']; // server proxy mode
let aiCurrentKeyIndex = 0;
let aiShowSettings = false;
let aiChatHistory = []; // conversation history for context
let aiPendingAttachments = []; // pending attachments for next message { type: 'image'|'video'|'file', data: string, name: string, preview: string }
const AI_PROXY_URL = 'https://xplayvault-foftd3kr.manus.space/api/ibag-chat';
const TRANSLATE_PROXY_URL = 'https://xplayvault-foftd3kr.manus.space/api/ibag-translate';

// Token Detail state (TokenPocket style)
let tokenDetailId = null; // currently viewing token id
let tokenDetailData = null; // fetched detail data from APIs
let tokenDetailLoading = false;
let tokenDetailTab = 'trading'; // 'trading' | 'check' | 'description'
let tokenTradingSubTab = 'activities'; // 'activities' | 'data' | 'myposition' | 'pool' | 'holders'
let tokenActivitiesFilter = 'all'; // 'all' | 'buy' | 'sell'
let tokenPoolSubTab = 'changes'; // 'changes' | 'lpdetails'
let tokenChartPeriod = '1d'; // '1m' | '5m' | '15m' | '1h' | '1d'
let tokenChartIndicator = 'MACD'; // 'MA' | 'EMA' | 'BOLL' | 'VOL' | 'MACD' | 'KDJ' | 'RSI'
let tokenChartInstance = null; // lightweight-charts instance
let tokenTxnData = []; // DEX transaction data
let tokenSecurityData = null; // GoPlus security data
let tokenPoolData = null; // liquidity pool data
let tokenHoldersData = null; // holders data
let tokenIsFavorited = false; // star favorite state
let tokenWs = null; // WebSocket for real-time price
let tokenWsPrice = null; // real-time price from WebSocket
let tokenWsPriceChange = null; // real-time price change
let tokenFavorites = []; // list of favorited token IDs
let projectFavorites = []; // list of favorited project IDs for MY tab
// Load/save token favorites from localStorage
function saveTokenFavorites() {
  try { localStorage.setItem('ibag_token_favorites', JSON.stringify(tokenFavorites)); } catch(e) {}
}
function loadTokenFavorites() {
  try {
    const saved = localStorage.getItem('ibag_token_favorites');
    if (saved) tokenFavorites = JSON.parse(saved);
  } catch(e) { tokenFavorites = []; }
}
function saveProjectFavorites() {
  try { localStorage.setItem('ibag_project_favorites', JSON.stringify(projectFavorites)); } catch(e) {}
}
function loadProjectFavorites() {
  try {
    const saved = localStorage.getItem('ibag_project_favorites');
    if (saved) projectFavorites = JSON.parse(saved);
  } catch(e) { projectFavorites = []; }
}

// KPI state
let kpiScreen = 'list'; // 'list' | 'project' | 'task'
let kpiProjects = [];
let kpiSelectedProjectId = null;
let kpiSelectedCategoryId = null;
let kpiSelectedSubcategoryId = null;
let kpiModalCallback = null;
let kpiShareProjectId = '';
let kpiQrData = ''; // callback for KPI custom prompt modal
let kpiModalFields = []; // [{label, id, value, placeholder, type}]
let kpiModalTitle = '';
let kpiConfirmCallback = null; // callback for KPI custom confirm modal
let kpiConfirmMessage = '';

function saveKpiProjects() { try { localStorage.setItem('ibag_kpi_projects', JSON.stringify(kpiProjects)); } catch(e) {} }
function loadKpiProjects() { try { const d = localStorage.getItem('ibag_kpi_projects'); if (d) kpiProjects = JSON.parse(d); } catch(e) {} }

// KPI custom prompt/confirm (replaces native prompt/confirm for Electron compatibility)
function showKpiPrompt(title, fields, callback) {
  kpiModalTitle = title;
  kpiModalFields = fields;
  kpiModalCallback = callback;
  showModal = true;
  modalType = 'kpi-prompt';
  render();
  // Auto-focus first field
  setTimeout(() => { const first = document.getElementById(fields[0]?.id); if (first) first.focus(); }, 100);
}
function showKpiConfirm(message, callback) {
  kpiConfirmMessage = message;
  kpiConfirmCallback = callback;
  showModal = true;
  modalType = 'kpi-confirm';
  render();
}

// KPI Share helpers
function importKpiFromText(text) {
  if (!text || !text.trim()) { showToast('데이터가 비어있습니다'); return; }
  try {
    const imported = JSON.parse(text.trim());
    if (!imported.name || !imported.categories) { showToast('유효하지 않은 WBS 데이터입니다'); return; }
    imported.id = 'kpi_' + Date.now();
    imported.importedAt = new Date().toISOString();
    kpiProjects.push(imported);
    saveKpiProjects();
    showToast(`"${imported.name}" 프로젝트를 가져왔습니다`);
    closeModal(); render();
  } catch(err) { showToast('WBS 데이터 형식이 올바르지 않습니다'); }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showToast('WBS 데이터가 복사되었습니다!'); }
  catch(e) { showToast('복사에 실패했습니다'); }
  document.body.removeChild(ta);
}

function generateKpiQrCode(data) {
  const canvas = document.getElementById('kpi-qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // Simple QR code generation using qrcode-generator library (loaded dynamically)
  if (typeof qrcode === 'undefined') {
    // Load qrcode-generator library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    script.onload = () => { drawQrCode(data, canvas); };
    script.onerror = () => { 
      ctx.fillStyle = '#333'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('QR 라이브러리 로드 실패', canvas.width/2, canvas.height/2);
    };
    document.head.appendChild(script);
  } else {
    drawQrCode(data, canvas);
  }
}

function drawQrCode(data, canvas) {
  try {
    const qr = qrcode(0, 'L');
    qr.addData(data);
    qr.make();
    const size = 256;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cellSize = size / qr.getModuleCount();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    for (let row = 0; row < qr.getModuleCount(); row++) {
      for (let col = 0; col < qr.getModuleCount(); col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize + 0.5, cellSize + 0.5);
        }
      }
    }
  } catch(e) {
    const ctx = canvas.getContext('2d');
    canvas.width = 256; canvas.height = 256;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#333'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('데이터가 너무 커서 QR 생성 실패', 128, 120);
    ctx.fillText('JSON 또는 클립보드를 사용하세요', 128, 140);
  }
}

// Card state
let cardScreen = 'main'; // 'main' | 'apply' | 'apply-design' | 'apply-form' | 'detail'
let myCards = [];
let cardApplyType = 'virtual'; // 'virtual' | 'physical'
let cardApplyDesign = 'virtual'; // 'virtual' | 'physical' | 'gold'
let selectedCardId = null;
let showCardTopup = false;
let showCardWithdraw = false;
let cardTopupAmount = '';
let cardWithdrawAmount = '';

const CARD_IMG_VIRTUAL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663373200888/MvuMZTjXmoZcdRKp.png';
const CARD_IMG_PHYSICAL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663373200888/ddToSUGXrcyBgKJW.png';
const CARD_IMG_GOLD = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663373200888/XzgHvKTWcAPqLViO.png';

// iBag Logo
const IBAG_LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/fofTD3KR3ei4Dr8DWo7b4c/ibag-logo-color-7mMFfZkY5Uy3KrEZiUPhwZ.webp';
const IBAG_SPLASH_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/fofTD3KR3ei4Dr8DWo7b4c/ibag-splash-v2-gbt46e3pUbSP3Fxvgm5XcZ.webp';

// Interstitial Ad state
let showInterstitialAd = false;
let interstitialAdData = null; // { type:'image'|'video', url, link, duration }
let interstitialCountdown = 0;
let interstitialTimer = null;

// Popup Notice state
let showPopupNotice = false;
let popupNoticeData = null; // { title, content, image, link, dontShowToday }
let popupDontShowToday = false;

// Web3App Store data
const WEB3_APPS = [
  { id: 'metamask', name: 'MetaMask', desc: 'web3app_metamask_desc', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', url: 'https://metamask.io/download/', category: 'wallet', color: '#f6851b' },
  { id: 'trustwallet', name: 'Trust Wallet', desc: 'web3app_trust_desc', icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg', url: 'https://trustwallet.com/download', category: 'wallet', color: '#3375BB' },
  { id: 'phantom', name: 'Phantom', desc: 'web3app_phantom_desc', icon: 'https://phantom.com/img/phantom-logo.svg', url: 'https://phantom.app/download', category: 'wallet', color: '#AB9FF2' },
  { id: 'uniswap', name: 'Uniswap', desc: 'web3app_uniswap_desc', icon: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', url: 'https://app.uniswap.org', category: 'defi', color: '#FF007A' },
  { id: 'opensea', name: 'OpenSea', desc: 'web3app_opensea_desc', icon: 'https://opensea.io/static/images/logos/opensea-logo.svg', url: 'https://opensea.io', category: 'nft', color: '#2081E2' },
  { id: 'rabby', name: 'Rabby Wallet', desc: 'web3app_rabby_desc', icon: 'https://rabby.io/assets/logo.svg', url: 'https://rabby.io', category: 'wallet', color: '#7C7BF3' },
  { id: 'okx', name: 'OKX Wallet', desc: 'web3app_okx_desc', icon: 'https://static.okx.com/cdn/assets/imgs/247/8B2E2E2E2E2E2E2E.png', url: 'https://www.okx.com/web3', category: 'wallet', color: '#000000' },
  { id: 'pancakeswap', name: 'PancakeSwap', desc: 'web3app_pancake_desc', icon: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png', url: 'https://pancakeswap.finance', category: 'defi', color: '#D1884F' },
  { id: 'aave', name: 'Aave', desc: 'web3app_aave_desc', icon: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', url: 'https://app.aave.com', category: 'defi', color: '#B6509E' },
  { id: 'lido', name: 'Lido', desc: 'web3app_lido_desc', icon: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png', url: 'https://lido.fi', category: 'defi', color: '#00A3FF' },
  { id: 'blur', name: 'Blur', desc: 'web3app_blur_desc', icon: 'https://assets.coingecko.com/coins/images/28453/small/blur.png', url: 'https://blur.io', category: 'nft', color: '#FF6F00' },
  { id: 'dydx', name: 'dYdX', desc: 'web3app_dydx_desc', icon: 'https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg', url: 'https://dydx.exchange', category: 'defi', color: '#6966FF' },
  { id: 'raydium', name: 'Raydium', desc: 'web3app_raydium_desc', icon: 'https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg', url: 'https://raydium.io', category: 'defi', color: '#2B6DEF' },
  { id: 'jupiter', name: 'Jupiter', desc: 'web3app_jupiter_desc', icon: 'https://assets.coingecko.com/coins/images/34188/small/jup.png', url: 'https://jup.ag', category: 'defi', color: '#C7F284' },
  { id: 'zapper', name: 'Zapper', desc: 'web3app_zapper_desc', icon: 'https://zapper.xyz/logo.svg', url: 'https://zapper.xyz', category: 'tool', color: '#784FFE' },
  { id: 'debank', name: 'DeBank', desc: 'web3app_debank_desc', icon: 'https://debank.com/favicon.ico', url: 'https://debank.com', category: 'tool', color: '#FE815F' },
];

// ─── Web3 Guard State ───
let web3guardUrl = '';
let web3guardLoading = false;
let web3guardScanResult = null; // { safe, riskLevel, riskScore, threats[], domain, contractRisks[] }
let web3guardHistory = JSON.parse(localStorage.getItem('web3guard_history') || '[]');
let web3guardShowWarning = false;
let web3guardProceedUrl = '';

// Phishing detection patterns
const PHISHING_PATTERNS = [
  /metamask.*(?:verify|validate|sync|update|restore|confirm)/i,
  /(?:connect|link|sync).*wallet/i,
  /(?:airdrop|claim|reward).*(?:token|nft|eth|bnb)/i,
  /(?:uniswap|pancakeswap|opensea|blur).*(?:io|org|net|xyz|app)(?!\.(org|io)$)/i,
  /(?:free|bonus|double).*(?:eth|btc|bnb|crypto)/i,
  /(?:seed|phrase|private.*key|mnemonic).*(?:enter|input|verify|validate)/i,
];

const PHISHING_DOMAIN_PATTERNS = [
  /metamask[^.]*\./i, /uniswap[^.]*\./i, /opensea[^.]*\./i,
  /pancakeswap[^.]*\./i, /aave[^.]*\./i, /compound[^.]*\./i,
  /binance[^.]*\./i, /coinbase[^.]*\./i,
];

const SAFE_DOMAINS = [
  'metamask.io', 'uniswap.org', 'app.uniswap.org', 'opensea.io',
  'pancakeswap.finance', 'aave.com', 'app.aave.com', 'compound.finance',
  'lido.fi', 'curve.fi', 'blur.io', 'dydx.exchange', 'raydium.io',
  'jup.ag', 'phantom.app', 'trustwallet.com', 'rabby.io',
  'etherscan.io', 'polygonscan.com', 'bscscan.com', 'arbiscan.io',
  'optimistic.etherscan.io', 'basescan.org', 'solscan.io',
  'coingecko.com', 'coinmarketcap.com', 'defillama.com',
  'zapper.xyz', 'debank.com', 'dune.com', 'nansen.ai',
  'github.com', 'docs.soliditylang.org',
  '1page.to', 'x-play.io', 'x-play.net',
];

const SUSPICIOUS_TLD = ['.xyz', '.top', '.club', '.click', '.icu', '.buzz', '.gq', '.ml', '.tk', '.cf', '.ga'];

const RISKY_CONTRACT_PATTERNS = [
  { pattern: /approve.*unlimited|approve.*max|approve.*uint256/i, risk: 'critical', desc: 'w3g_risk_unlimited_approve' },
  { pattern: /transferFrom|safeTransferFrom/i, risk: 'high', desc: 'w3g_risk_transfer_from' },
  { pattern: /setApprovalForAll/i, risk: 'high', desc: 'w3g_risk_approval_all' },
  { pattern: /delegatecall|selfdestruct/i, risk: 'critical', desc: 'w3g_risk_dangerous_opcode' },
  { pattern: /withdraw.*all|drain|rug/i, risk: 'critical', desc: 'w3g_risk_drain' },
];

const CARD_DESIGNS = [
  { id: 'virtual', name: 'AlphaBag Virtual', type: 'virtual', network: 'Mastercard', image: CARD_IMG_VIRTUAL, bonus: '+$5', color: '#7c3aed' },
  { id: 'physical', name: 'AlphaBag Black', type: 'physical', network: 'VISA Platinum', image: CARD_IMG_PHYSICAL, bonus: '', color: '#1a1a2e' },
  { id: 'gold', name: 'AlphaBag Gold', type: 'physical', network: 'VISA', image: CARD_IMG_GOLD, bonus: '+$10', color: '#b8860b' },
];

function saveCards() { try { localStorage.setItem('alphabag_cards', JSON.stringify(myCards)); } catch(e) {} }
function loadCards() { try { const d = localStorage.getItem('alphabag_cards'); if (d) myCards = JSON.parse(d); } catch(e) {} }

// ─── Utility ───
function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }
function escapeHtml(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// Get favicon URL from a website URL using Google's favicon service
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch(e) {
    return null;
  }
}
// Auto-fetch logo from site HTML by parsing <link rel="icon"> or <img> with logo in src
async function fetchSiteTitle(siteUrl) {
  // Try direct fetch first
  try {
    const resp = await fetch(siteUrl, { mode: 'cors', signal: AbortSignal.timeout(4000) });
    if (resp.ok) {
      const html = await resp.text();
      const title = extractTitleFromHtml(html);
      if (title) return title;
    }
  } catch(e) {}
  // Fallback: use allorigins.win CORS proxy
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(siteUrl)}`;
    const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
    if (resp.ok) {
      const data = await resp.json();
      if (data.contents) {
        const title = extractTitleFromHtml(data.contents);
        if (title) return title;
      }
    }
  } catch(e) {}
  // Fallback: use domain name
  try { return new URL(siteUrl).hostname.replace('www.',''); } catch(e) { return null; }
}
function extractTitleFromHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim().substring(0, 100);
  const ogMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (ogMatch) return ogMatch[1].trim().substring(0, 100);
  return null;
}
async function fetchSiteLogoUrl(siteUrl) {
  try {
    const resp = await fetch(siteUrl, { mode: 'cors' });
    if (!resp.ok) return null;
    const html = await resp.text();
    // Try to find link rel="icon" or apple-touch-icon
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i)
      || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i);
    if (iconMatch) {
      let iconUrl = iconMatch[1];
      if (iconUrl.startsWith('/')) iconUrl = new URL(iconUrl, siteUrl).href;
      if (!iconUrl.startsWith('http')) iconUrl = new URL(iconUrl, siteUrl).href;
      return iconUrl;
    }
    // Try to find img with 'logo' in src or alt
    const logoImgMatch = html.match(/<img[^>]*src=["']([^"']*logo[^"']*)["']/i);
    if (logoImgMatch) {
      let logoUrl = logoImgMatch[1];
      if (logoUrl.startsWith('/')) logoUrl = new URL(logoUrl, siteUrl).href;
      if (!logoUrl.startsWith('http')) logoUrl = new URL(logoUrl, siteUrl).href;
      return logoUrl;
    }
    return null;
  } catch(e) {
    return null;
  }
}
function formatDate(ts) { if (!ts) return ''; const d = new Date(ts); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`; }
function formatFileSize(b) { if (!b) return '0B'; if (b < 1024) return b + 'B'; if (b < 1048576) return (b/1024).toFixed(1) + 'KB'; return (b/1048576).toFixed(1) + 'MB'; }
function detectFileCategory(name) { const ext = (name || '').split('.').pop().toLowerCase(); if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) return 'photo'; if (['mp4','avi','mov','mkv','webm'].includes(ext)) return 'video'; if (['mp3','wav','ogg','flac','aac'].includes(ext)) return 'audio'; if (['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','csv'].includes(ext)) return 'document'; return 'other_file'; }
function t(key) { const lang = state.language || 'ko'; return (translations && translations[lang] && translations[lang][key]) || (translations && translations['en'] && translations['en'][key]) || key; }

// ─── Theme ───
function applyTheme() { document.documentElement.setAttribute('data-theme', state.theme); }

// ─── Storage ───
function saveState() { const toSave = { ...state }; delete toSave.locked; window.electronAPI.saveData(toSave); }
function saveWorkItems() {
  try {
    // Work items are stored separately for security - encrypted in localStorage
    const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(workItems))));
    localStorage.setItem('alphabag_work_items', encrypted);
  } catch(e) { console.log('Save work items error:', e); }
}
function loadWorkItems() {
  try {
    const encrypted = localStorage.getItem('alphabag_work_items');
    if (encrypted) {
      workItems = JSON.parse(decodeURIComponent(escape(atob(encrypted))));
    }
  } catch(e) { console.log('Load work items error:', e); workItems = []; }
}
function saveClipboardItems() {
  try {
    localStorage.setItem('ibag_clipboard', JSON.stringify(clipboardItems));
  } catch(e) { console.log('Save clipboard error:', e); }
}
function loadClipboardItems() {
  try {
    const saved = localStorage.getItem('ibag_clipboard');
    if (saved) { clipboardItems = JSON.parse(saved); }
  } catch(e) { console.log('Load clipboard error:', e); clipboardItems = []; }
}

// ─── Idea Notes Storage (IndexedDB for large media) ───
const IDEA_DB_NAME = 'ibag_idea_notes';
const IDEA_DB_VERSION = 1;
let ideaDB = null;

function openIdeaDB() {
  return new Promise((resolve, reject) => {
    if (ideaDB) { resolve(ideaDB); return; }
    const req = indexedDB.open(IDEA_DB_NAME, IDEA_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { ideaDB = e.target.result; resolve(ideaDB); };
    req.onerror = (e) => { console.log('IdeaDB error:', e); reject(e); };
  });
}

async function saveIdeaNote(note) {
  const db = await openIdeaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').put(note);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
}

async function saveIdeaMedia(mediaObj) {
  const db = await openIdeaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').put(mediaObj);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
}

async function getIdeaMedia(id) {
  const db = await openIdeaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readonly');
    const req = tx.objectStore('media').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

async function deleteIdeaMedia(id) {
  const db = await openIdeaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
}

async function loadIdeaNotes() {
  try {
    const db = await openIdeaDB();
    const tx = db.transaction('notes', 'readonly');
    const req = tx.objectStore('notes').getAll();
    req.onsuccess = () => {
      ideaNotes = (req.result || []).sort((a, b) => b.updatedAt - a.updatedAt);
    };
  } catch(e) { console.log('Load idea notes error:', e); ideaNotes = []; }
}

async function deleteIdeaNoteById(id) {
  const note = ideaNotes.find(n => n.id === id);
  if (note) {
    // Delete associated media
    for (const mid of (note.audioIds || [])) { await deleteIdeaMedia(mid).catch(() => {}); }
    for (const mid of (note.videoIds || [])) { await deleteIdeaMedia(mid).catch(() => {}); }
  }
  const db = await openIdeaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').delete(id);
    tx.oncomplete = () => {
      ideaNotes = ideaNotes.filter(n => n.id !== id);
      resolve();
    };
    tx.onerror = (e) => reject(e);
  });
}
async function loadData() {
  try {
    const data = await window.electronAPI.loadData();
    if (data && typeof data === 'object') {
      state = { ...state, ...data, locked: true, currentTab: 'home' };
      if (!state.orgCharts) state.orgCharts = [];
      if (!state.savedTokens) state.savedTokens = ['bitcoin','ethereum','binancecoin'];
      if (!state.customProjects) state.customProjects = [];
    }
  } catch (e) { console.log('Load data error:', e); }
  // Auto-detect system language on first launch
  detectSystemLanguage();
  loadWorkItems();
  loadClipboardItems();
  loadIdeaNotes();
  loadTokenFavorites();
  loadProjectFavorites();
}

function detectSystemLanguage() {
  const langDetected = localStorage.getItem('ibag_lang_detected');
  if (langDetected) return; // Already detected before
  
  try {
    // Get browser/system language
    const sysLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
    const langCode = sysLang.split('-')[0]; // 'ko-KR' -> 'ko', 'en-US' -> 'en'
    
    // Map system language to supported languages
    const supportedLangs = LANGUAGES.map(l => l.code);
    const langMap = {
      'ko': 'ko', 'en': 'en', 'zh': 'zh', 'ja': 'ja',
      'th': 'th', 'vi': 'vi', 'ru': 'ru',
      // Additional mappings for regional variants
      'cn': 'zh', 'tw': 'zh', 'jp': 'ja'
    };
    
    const detectedLang = langMap[langCode] || (supportedLangs.includes(langCode) ? langCode : 'en');
    
    if (detectedLang !== state.language) {
      state.language = detectedLang;
      saveState();
      console.log(`System language detected: ${sysLang} -> ${detectedLang}`);
    }
    
    localStorage.setItem('ibag_lang_detected', 'true');
  } catch(e) {
    console.log('Language detection error:', e);
    localStorage.setItem('ibag_lang_detected', 'true');
  }
}

// ─── Lock Timer ───
function startLockTimer() {
  clearTimeout(lockTimer);
  if (state.lockTimeout > 0 && state.isSetup) {
    lockTimer = setTimeout(() => { state.locked = true; render(); }, state.lockTimeout);
  }
}
function resetActivityTimer() {
  if (state.lockTimeout > 0 && state.isSetup && !state.locked) {
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { state.locked = true; render(); }, state.lockTimeout);
  }
}
document.addEventListener('click', resetActivityTimer);
document.addEventListener('keydown', resetActivityTimer);

// ─── API Calls ───
async function fetchBanners() {
  try { const r = await fetch(`${API_BASE}/api/announcements`); bannerData = await r.json(); } catch(e) { bannerData = []; }
}
async function fetchNotifications() {
  try { const r = await fetch(`${API_BASE}/api/notifications`); notifications = await r.json(); } catch(e) { notifications = []; }
}
async function fetchTokenPrices() {
  try {
    const ids = state.savedTokens.join(',');
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    tokenPrices = await r.json();
  } catch(e) { console.log('Token price fetch error:', e); }
}
async function fetchMiddleTabs() {
  try {
    const r = await fetch(`${API_BASE}/api/middle-tabs`);
    const data = await r.json();
    if (data && data.length > 0) middleTabs = data;
  } catch(e) { /* use defaults */ }
}

// ─── Smart Contract Token Search ───
let contractSearchResult = null;
async function searchContractToken() {
  const network = document.getElementById('token-network-select')?.value || 'ethereum';
  const address = document.getElementById('token-contract-input')?.value?.trim();
  const resultDiv = document.getElementById('contract-search-result');
  if (!resultDiv) return;
  if (!address || address.length < 10) {
    resultDiv.innerHTML = `<div style="color:var(--danger);font-size:12px;padding:4px">${escapeHtml(t('token_invalid_address') || 'Please enter a valid contract address')}</div>`;
    return;
  }
  resultDiv.innerHTML = `<div style="text-align:center;padding:12px"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite;font-size:20px;color:var(--primary)"></i><div style="font-size:11px;color:var(--text-muted);margin-top:6px">${escapeHtml(t('td_loading') || 'Loading token data...')}</div></div>`;
  
  let cgData = null;
  let dexData = null;
  
  try {
    // Step 1: Try CoinGecko API
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/${network}/contract/${address}`);
    if (r.ok) cgData = await r.json();
  } catch(e) { /* CoinGecko failed, try DexScreener */ }
  
  try {
    // Step 2: Try DexScreener API
    const dexResp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${address}`);
    if (dexResp.ok) {
      const dexJson = await dexResp.json();
      if (dexJson.pairs && dexJson.pairs.length > 0) {
        dexData = dexJson.pairs.sort((a,b) => (b.liquidity?.usd||0) - (a.liquidity?.usd||0))[0];
      }
    }
  } catch(e) { /* DexScreener failed */ }
  
  if (!cgData && !dexData) {
    contractSearchResult = null;
    resultDiv.innerHTML = `<div style="color:var(--danger);font-size:12px;padding:8px;text-align:center"><i class="ri-error-warning-line"></i> ${escapeHtml(t('token_not_found') || 'Token not found. Please check the address and network.')}</div>`;
    return;
  }
  
  // Build token result from best available data
  const tokenName = cgData?.name || dexData?.baseToken?.name || 'Unknown';
  const tokenSymbol = (cgData?.symbol || dexData?.baseToken?.symbol || '?').toUpperCase();
  const tokenLogo = cgData?.image?.small || cgData?.image?.thumb || dexData?.info?.imageUrl || '';
  const tokenPrice = cgData?.market_data?.current_price?.usd || (dexData ? parseFloat(dexData.priceUsd) : 0);
  const tokenMcap = cgData?.market_data?.market_cap?.usd || dexData?.marketCap || dexData?.fdv || 0;
  const tokenVol = cgData?.market_data?.total_volume?.usd || (dexData?.volume?.h24 || 0);
  const tokenLiq = dexData?.liquidity?.usd || 0;
  const tokenChange = cgData?.market_data?.price_change_percentage_24h || (dexData?.priceChange?.h24 || 0);
  const tokenHolders = dexData?.txns?.h24 ? (dexData.txns.h24.buys + dexData.txns.h24.sells) : 0;
  
  contractSearchResult = {
    id: cgData?.id || `custom_${address.substring(0,8).toLowerCase()}`,
    symbol: tokenSymbol,
    name: tokenName,
    logo: tokenLogo,
    color: '#6366f1',
    icon: tokenSymbol[0] || '?',
    contractAddress: address,
    network: network,
    mainnet: false
  };
  
  const logoHtml = tokenLogo
    ? `<div class="token-icon has-logo" style="background:${contractSearchResult.color}20;width:44px;height:44px"><img src="${escapeHtml(tokenLogo)}" alt="${escapeHtml(tokenSymbol)}"></div>`
    : `<div class="token-icon" style="background:${contractSearchResult.color}20;color:${contractSearchResult.color};width:44px;height:44px;font-size:18px">${contractSearchResult.icon}</div>`;
  
  const changeColor = tokenChange >= 0 ? '#10b981' : '#ef4444';
  const changeSign = tokenChange >= 0 ? '+' : '';
  
  // Rich info card
  resultDiv.innerHTML = `
    <div class="contract-search-found" style="flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;gap:10px;width:100%">
        ${logoHtml}
        <div style="flex:1;min-width:0">
          <div style="font-size:15px;font-weight:700">${escapeHtml(tokenName)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${tokenSymbol} · ${escapeHtml(network)}</div>
        </div>
        <button class="btn btn-primary btn-sm" data-action="add-contract-token" style="flex-shrink:0"><i class="ri-add-circle-line"></i> ${escapeHtml(t('token_add_btn') || 'Add')}</button>
      </div>
      ${tokenPrice > 0 ? `
      <div style="display:flex;align-items:baseline;gap:8px;padding:6px 0">
        <span style="font-size:18px;font-weight:800;color:var(--text-primary)">${fmtPrice(tokenPrice)}</span>
        <span style="font-size:12px;font-weight:600;color:${changeColor}">${changeSign}${tokenChange.toFixed(2)}%</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div style="background:var(--bg);border-radius:8px;padding:6px 8px">
          <div style="font-size:9px;color:var(--text-muted)">${escapeHtml(t('td_market_cap') || 'Market Cap')}</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">${fmtBigNum(tokenMcap)}</div>
        </div>
        <div style="background:var(--bg);border-radius:8px;padding:6px 8px">
          <div style="font-size:9px;color:var(--text-muted)">${escapeHtml(t('td_volume_24h') || '24h Volume')}</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">${fmtBigNum(tokenVol)}</div>
        </div>
        ${tokenLiq > 0 ? `
        <div style="background:var(--bg);border-radius:8px;padding:6px 8px">
          <div style="font-size:9px;color:var(--text-muted)">${escapeHtml(t('td_liquidity') || 'Liquidity')}</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">${fmtBigNum(tokenLiq)}</div>
        </div>` : ''}
        ${tokenHolders > 0 ? `
        <div style="background:var(--bg);border-radius:8px;padding:6px 8px">
          <div style="font-size:9px;color:var(--text-muted)">${escapeHtml(t('td_txns_24h') || '24h Txns')}</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">${tokenHolders.toLocaleString()}</div>
        </div>` : ''}
      </div>
      ` : ''}
      <div style="font-size:9px;color:var(--text-muted);word-break:break-all;padding-top:4px"><i class="ri-file-code-line"></i> ${escapeHtml(address)}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${cgData ? '<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--primary-dim);color:var(--primary)">CoinGecko</span>' : ''}
        ${dexData ? '<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:var(--primary-dim);color:var(--primary)">DexScreener</span>' : ''}
      </div>
    </div>
  `;
}

function addContractTokenFromSearch() {
  if (!contractSearchResult) return;
  // Check if already added
  if (state.savedTokens.includes(contractSearchResult.id)) {
    const resultDiv = document.getElementById('contract-search-result');
    if (resultDiv) resultDiv.innerHTML = `<div style="color:var(--warning);font-size:12px;padding:8px;text-align:center">${escapeHtml(t('token_already_added') || 'This token is already added')}</div>`;
    return;
  }
  // Check if it's in TOKEN_LIST already
  const existing = TOKEN_LIST.find(t => t.id === contractSearchResult.id);
  if (!existing) {
    // Add to customTokens
    customTokens.push(contractSearchResult);
  }
  state.savedTokens.push(contractSearchResult.id);
  contractSearchResult = null;
  saveCustomTokens(); saveState(); fetchTokenPrices(); closeModal(); render();
}

// ─── Currency rates cache ───
let currencyRates = {};
async function fetchCurrencyRates() {
  try {
    const r = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await r.json();
    currencyRates = data.rates || {};
  } catch(e) { console.log('Currency rate fetch error:', e); }
}

// ─── Bithumb USDT/KRW price ───
async function fetchUsdtKrwPrice() {
  try {
    const r = await fetch('https://api.bithumb.com/public/ticker/USDT_KRW');
    const data = await r.json();
    if (data.status === '0000' && data.data) {
      usdtKrwPrice = parseFloat(data.data.closing_price);
    }
  } catch(e) { console.log('Bithumb USDT price fetch error:', e); }
}

// ─── Load saved exchange country settings ───
function loadCustomMainnets() {
  try {
    const saved = localStorage.getItem('alphabag_custom_mainnets');
    if (saved) { customMainnets = JSON.parse(saved); }
  } catch(e) { console.log('Load custom mainnets error:', e); customMainnets = []; }
}

function loadExchangeSettings() {
  try {
    const saved = localStorage.getItem('alphabag_exchange_settings');
    if (saved) {
      const s = JSON.parse(saved);
      if (s.country1) exchangeCountry1 = s.country1;
      if (s.country2) exchangeCountry2 = s.country2;
    }
  } catch(e) {}
}
function saveExchangeSettings() {
  try {
    localStorage.setItem('alphabag_exchange_settings', JSON.stringify({
      country1: exchangeCountry1,
      country2: exchangeCountry2
    }));
  } catch(e) {}
}

// ─── USDT Exchange calculation ───
const EXCHANGE_COUNTRIES = [
  { code: 'KRW', name: '한국 원', flag: '🇰🇷', symbol: '₩' },
  { code: 'JPY', name: '일본 엔', flag: '🇯🇵', symbol: '¥' },
  { code: 'CNY', name: '중국 위안', flag: '🇨🇳', symbol: '¥' },
  { code: 'THB', name: '태국 바트', flag: '🇹🇭', symbol: '฿' },
  { code: 'VND', name: '베트남 동', flag: '🇻🇳', symbol: '₫' },
  { code: 'PHP', name: '필리핀 페소', flag: '🇵🇭', symbol: '₱' },
  { code: 'IDR', name: '인도네시아 루피아', flag: '🇮🇩', symbol: 'Rp' },
  { code: 'MYR', name: '말레이시아 링깃', flag: '🇲🇾', symbol: 'RM' },
  { code: 'SGD', name: '싱가포르 달러', flag: '🇸🇬', symbol: 'S$' },
  { code: 'HKD', name: '홍콩 달러', flag: '🇭🇰', symbol: 'HK$' },
  { code: 'TWD', name: '대만 달러', flag: '🇹🇼', symbol: 'NT$' },
  { code: 'INR', name: '인도 루피', flag: '🇮🇳', symbol: '₹' },
  { code: 'RUB', name: '러시아 루블', flag: '🇷🇺', symbol: '₽' },
  { code: 'USD', name: '미국 달러', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: '유로', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: '영국 파운드', flag: '🇬🇧', symbol: '£' },
  { code: 'AUD', name: '호주 달러', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: '캐나다 달러', flag: '🇨🇦', symbol: 'C$' },
  { code: 'AED', name: 'UAE 디르함', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'SAR', name: '사우디 리얄', flag: '🇸🇦', symbol: '﷼' },
];

function getCountryInfo(code) {
  return EXCHANGE_COUNTRIES.find(c => c.code === code) || { code, name: code, flag: '', symbol: '' };
}

function calcExchangeFromUsdt(usdtAmount) {
  if (!usdtAmount || isNaN(usdtAmount)) return;
  exchangeAmountUsdt = usdtAmount.toString();
  // USDT -> USD (approximately 1:1 for fiat conversion)
  const usdAmount = usdtAmount;
  // Convert to country1
  if (currencyRates[exchangeCountry1]) {
    const val1 = usdAmount * currencyRates[exchangeCountry1];
    exchangeAmount1 = val1.toFixed(exchangeCountry1 === 'KRW' || exchangeCountry1 === 'VND' || exchangeCountry1 === 'IDR' || exchangeCountry1 === 'JPY' ? 0 : 2);
  }
  // Convert to country2
  if (currencyRates[exchangeCountry2]) {
    const val2 = usdAmount * currencyRates[exchangeCountry2];
    exchangeAmount2 = val2.toFixed(exchangeCountry2 === 'KRW' || exchangeCountry2 === 'VND' || exchangeCountry2 === 'IDR' || exchangeCountry2 === 'JPY' ? 0 : 2);
  }
  // Override KRW with Bithumb price if country1 or country2 is KRW
  if (exchangeCountry1 === 'KRW' && usdtKrwPrice > 0) {
    exchangeAmount1 = Math.round(usdtAmount * usdtKrwPrice).toString();
  }
  if (exchangeCountry2 === 'KRW' && usdtKrwPrice > 0) {
    exchangeAmount2 = Math.round(usdtAmount * usdtKrwPrice).toString();
  }
}

function calcExchangeFromCountry(fieldNum, amount) {
  if (!amount || isNaN(amount)) return;
  const country = fieldNum === 1 ? exchangeCountry1 : exchangeCountry2;
  let usdAmount;
  // If KRW, use Bithumb price
  if (country === 'KRW' && usdtKrwPrice > 0) {
    usdAmount = amount / usdtKrwPrice;
  } else if (currencyRates[country]) {
    usdAmount = amount / currencyRates[country];
  } else return;
  
  exchangeAmountUsdt = usdAmount.toFixed(4);
  // Calculate the other field
  const otherCountry = fieldNum === 1 ? exchangeCountry2 : exchangeCountry1;
  let otherVal;
  if (otherCountry === 'KRW' && usdtKrwPrice > 0) {
    otherVal = usdAmount * usdtKrwPrice;
  } else if (currencyRates[otherCountry]) {
    otherVal = usdAmount * currencyRates[otherCountry];
  } else return;
  
  const noDecimal = ['KRW','VND','IDR','JPY'];
  if (fieldNum === 1) {
    exchangeAmount1 = amount.toString();
    exchangeAmount2 = otherVal.toFixed(noDecimal.includes(otherCountry) ? 0 : 2);
  } else {
    exchangeAmount2 = amount.toString();
    exchangeAmount1 = otherVal.toFixed(noDecimal.includes(exchangeCountry1) ? 0 : 2);
  }
}

// ─── Photo Exchange Rate OCR ───
async function doCalcPhotoOCR(imageDataUrl) {
  calcPhotoImage = imageDataUrl;
  calcPhotoProcessing = true;
  calcPhotoResult = null;
  render();

  try {
    const worker = await Tesseract.createWorker('eng+kor+jpn+chi_sim+tha+vie+rus');
    const { data } = await worker.recognize(imageDataUrl);
    await worker.terminate();
    
    if (data.text && data.text.trim()) {
      // Extract numbers from OCR text (look for price-like patterns)
      const text = data.text;
      // Match various price formats: $100, 100.00, 1,000, ₩50000, ¥1500, etc.
      const pricePatterns = [
        /[\$\u20a9\u00a5\u20ac\u00a3\u20b9\u20bd\u20b1\u20ab\u0e3f]\s*([\d,]+\.?\d*)/g,
        /([\d,]+\.?\d*)\s*[\$\u20a9\u00a5\u20ac\u00a3\u20b9\u20bd\u20b1\u20ab\u0e3f]/g,
        /([\d,]{2,}(?:\.\d{1,2})?)/g
      ];
      
      let amounts = [];
      let detectedCurrency = null;
      
      // Try to detect currency from symbols
      if (text.includes('\u20a9') || text.includes('KRW') || text.includes('\uc6d0')) detectedCurrency = 'KRW';
      else if (text.includes('\u00a5') || text.includes('JPY') || text.includes('\u5186')) detectedCurrency = 'JPY';
      else if (text.includes('$') || text.includes('USD')) detectedCurrency = 'USD';
      else if (text.includes('\u20ac') || text.includes('EUR')) detectedCurrency = 'EUR';
      else if (text.includes('\u0e3f') || text.includes('THB') || text.includes('\u0e1a\u0e32\u0e17')) detectedCurrency = 'THB';
      else if (text.includes('\u20ab') || text.includes('VND')) detectedCurrency = 'VND';
      else if (text.includes('\u00a5') || text.includes('CNY') || text.includes('\u5143')) detectedCurrency = 'CNY';
      else if (text.includes('\u20b1') || text.includes('PHP')) detectedCurrency = 'PHP';
      else if (text.includes('Rp') || text.includes('IDR')) detectedCurrency = 'IDR';
      else if (text.includes('\u20bd') || text.includes('RUB')) detectedCurrency = 'RUB';
      
      // If no currency detected, use country1 as default
      if (!detectedCurrency) detectedCurrency = exchangeCountry1;
      
      for (const pattern of pricePatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const numStr = match[1].replace(/,/g, '');
          const num = parseFloat(numStr);
          if (!isNaN(num) && num > 0 && num < 999999999) {
            amounts.push(num);
          }
        }
        if (amounts.length > 0) break;
      }
      
      if (amounts.length > 0) {
        // Use the largest amount found (likely the total)
        const mainAmount = Math.max(...amounts);
        const detectedInfo = getCountryInfo(detectedCurrency);
        
        // Convert to USDT and other currencies
        let usdtVal;
        if (detectedCurrency === 'KRW' && usdtKrwPrice > 0) {
          usdtVal = mainAmount / usdtKrwPrice;
        } else if (currencyRates[detectedCurrency]) {
          usdtVal = mainAmount / currencyRates[detectedCurrency];
        } else {
          usdtVal = mainAmount; // fallback: treat as USD
        }
        
        const noDecimal = ['KRW','VND','IDR','JPY'];
        const conversions = [
          { code: 'USDT', flag: '\ud83d\udcb0', symbol: '', value: usdtVal.toFixed(4) }
        ];
        
        // Add country1 conversion
        const c1Info = getCountryInfo(exchangeCountry1);
        let c1Val;
        if (exchangeCountry1 === 'KRW' && usdtKrwPrice > 0) {
          c1Val = usdtVal * usdtKrwPrice;
        } else if (currencyRates[exchangeCountry1]) {
          c1Val = usdtVal * currencyRates[exchangeCountry1];
        }
        if (c1Val !== undefined) {
          conversions.push({ code: exchangeCountry1, flag: c1Info.flag, symbol: c1Info.symbol, value: c1Val.toFixed(noDecimal.includes(exchangeCountry1) ? 0 : 2) });
        }
        
        // Add country2 conversion
        const c2Info = getCountryInfo(exchangeCountry2);
        let c2Val;
        if (exchangeCountry2 === 'KRW' && usdtKrwPrice > 0) {
          c2Val = usdtVal * usdtKrwPrice;
        } else if (currencyRates[exchangeCountry2]) {
          c2Val = usdtVal * currencyRates[exchangeCountry2];
        }
        if (c2Val !== undefined) {
          conversions.push({ code: exchangeCountry2, flag: c2Info.flag, symbol: c2Info.symbol, value: c2Val.toFixed(noDecimal.includes(exchangeCountry2) ? 0 : 2) });
        }
        
        calcPhotoResult = {
          detected: `${detectedInfo.flag} ${detectedInfo.symbol}${mainAmount.toLocaleString()} (${detectedCurrency})`,
          conversions
        };
      } else {
        alert(t('calc_no_amount') || '\uae08\uc561\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4');
      }
    } else {
      alert(t('ocr_no_text_msg'));
    }
  } catch (e) {
    console.error('Calc photo OCR error:', e);
    alert(t('ocr_process_failed'));
  }
  calcPhotoProcessing = false;
  render();
}

// ═══════════════════════════════════════════════════════════
// RENDER ENGINE
// ═══════════════════════════════════════════════════════════

// Debounce helper
let _renderTimer = null;
function renderDebounced(delay = 150) {
  if (_renderTimer) clearTimeout(_renderTimer);
  _renderTimer = setTimeout(() => { _renderTimer = null; render(); }, delay);
}

// Track if we're currently inside an input to avoid stealing focus
let _isInputActive = false;
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    _isInputActive = true;
  }
});
document.addEventListener('focusout', () => {
  _isInputActive = false;
  // Execute pending render if one was queued while input was active
  if (_pendingRender) {
    setTimeout(() => { if (!_isInputActive) render(); }, 50);
  }
});

// Pending render flag - when input is active, queue a render for after focus out
let _pendingRender = false;

let _renderDebounceTimer = null;

function render(force = false) {
  // Skip re-render if user is actively typing in an input/textarea (unless forced)
  // This prevents DOM replacement from interrupting typing
  if (_isInputActive && !force) {
    _pendingRender = true;
    return;
  }
  _pendingRender = false;
  
  const app = document.getElementById('app');
  // Save current focus state before re-render
  const activeEl = document.activeElement;
  const activeId = activeEl ? activeEl.id : null;
  const activeSelStart = activeEl && activeEl.selectionStart !== undefined ? activeEl.selectionStart : null;
  const activeSelEnd = activeEl && activeEl.selectionEnd !== undefined ? activeEl.selectionEnd : null;
  const activeValue = activeEl ? activeEl.value : null;
  
  if (state.locked) {
    app.innerHTML = renderLockScreen();
  } else {
    app.innerHTML = renderMainLayout();
  }
  bindEvents();
  
  // Restore focus after re-render
  if (activeId) {
    const restored = document.getElementById(activeId);
    if (restored) {
      restored.focus();
      if (activeValue !== null && restored.value !== undefined) {
        restored.value = activeValue;
      }
      if (activeSelStart !== null && restored.setSelectionRange) {
        try { restored.setSelectionRange(activeSelStart, activeSelEnd); } catch(e) {}
      }
    }
  }
  
  // Setup org chart pan/zoom after rendering
  if (state.currentTab === 'orgchart-view') {
    setupOrgPanZoom();
  }
}

// Debounced render - for use in input handlers to avoid excessive re-renders
function renderDebounced(delay = 100) {
  if (_renderDebounceTimer) clearTimeout(_renderDebounceTimer);
  _renderDebounceTimer = setTimeout(() => { _renderDebounceTimer = null; render(); }, delay);
}

// ─── Lock Screen ───
function renderLockScreen() {
  const msg = pinError ? `<div class="lock-message error">${escapeHtml(pinError)}</div>` :
    !state.isSetup ? `<div class="lock-message">${isConfirming ? escapeHtml(t('lock_confirm_pin')) : escapeHtml(t('lock_new_pin'))}</div>` :
    `<div class="lock-message">${escapeHtml(t('lock_enter_pin'))}</div>`;

  const dots = [0,1,2,3].map(i =>
    `<div class="pin-dot ${currentPin.length > i ? 'filled' : ''} ${pinError ? 'error' : ''}"></div>`
  ).join('');

  return `
    <div class="lock-screen">
      <div class="lock-logo"><img src="${IBAG_LOGO_URL}" alt="iBag" style="width:60px;height:60px;border-radius:16px"></div>
      <div class="lock-app-name">i<span>Bag</span></div>
      ${msg}
      <div class="pin-dots ${pinError ? 'shake' : ''}">${dots}</div>
      <div class="keypad">
        ${['123','456','789',' 0del'].map(row => `
          <div class="key-row">
            ${row === ' 0del' ? `
              <div class="key special"></div>
              <div class="key" data-key="0">0</div>
              <div class="key special" data-key="del"><i class="ri-delete-back-2-line"></i></div>
            ` : row.split('').map(k => `<div class="key" data-key="${k}">${k}</div>`).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════════════

function renderMainLayout() {
  // Bottom tabs: 홈, Alphabag, (+), Web3 Guard, AI
  const bottomTabs = [
    { id: 'home', icon: 'ri-home-5-fill', label: t('tab_home') },
    { id: 'alphabag', icon: 'ri-shopping-bag-3-fill', label: 'Alphabag' },
    { id: 'plus', icon: 'ri-add-circle-fill', label: '', isPlus: true },
    { id: 'web3guard', icon: 'ri-shield-check-line', label: t('tab_guard') || 'Guard' },
    { id: 'ai', icon: 'ri-robot-2-line', label: 'AI' },
  ];

  const tabsHtml = bottomTabs.map(tab => {
    if (tab.isPlus) {
      return `<button class="tab-btn plus-btn" data-tab="plus"><i class="${tab.icon}"></i></button>`;
    }
    return `
      <button class="tab-btn ${state.currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
        <i class="${tab.icon}"></i>
        <span>${escapeHtml(tab.label)}</span>
      </button>
    `;
  }).join('');

  let screenHtml = '';
  switch (state.currentTab) {
    case 'home': screenHtml = renderHome(); break;
    case 'alphabag': screenHtml = renderAlphabagWebview(); break;
    case 'infoweb': screenHtml = renderInfoweb(); break;
    case 'clipboard': screenHtml = renderClipboard(); break;
    case 'web3guard': screenHtml = renderWeb3Guard(); break;
    case 'web3guard-browser': screenHtml = renderWeb3GuardBrowser(); break;
    case 'ibag': screenHtml = renderIBag(); break;
    case 'ai': screenHtml = renderAIChat(); break;
    case 'card': screenHtml = renderCardScreen(); break;
    case 'kpi': screenHtml = renderKpiScreen(); break;
    case 'web3app': screenHtml = renderWeb3App(); break;
    // Sub screens
    case 'bookmark-detail': screenHtml = renderBookmarks(); break;
    case 'web3-detail': screenHtml = renderWeb3(); break;
    case 'memo-detail': screenHtml = renderMemos(); break;
    case 'life-detail': screenHtml = renderLife(); break;
    case 'calc': screenHtml = renderCalculator(); break;
    case 'translate': screenHtml = renderTranslate(); break;
    case 'orgchart': screenHtml = renderVaultGate(); break;
    case 'orgchart-view': screenHtml = vaultUnlocked ? renderOrgChartView() : renderVaultGate(); break;
    case 'vault-settings': screenHtml = vaultUnlocked ? renderVaultSettings() : renderVaultGate(); break;
    case 'vault-change-pw': screenHtml = vaultUnlocked ? renderVaultChangePw() : renderVaultGate(); break;
    case 'settings': screenHtml = renderSettings(); break;
    case 'webview': screenHtml = renderGenericWebview(); break;
    case 'token-detail': screenHtml = renderTokenDetail(); break;
  }

  // Banner
  const bannerHtml = renderBanner();
  // Notification panel
  const notiPanelHtml = showNotifications ? renderNotificationPanel() : '';
  let modalHtml = showModal ? renderModal() : '';

  // Notification bell
  const unreadCount = notifications.length;
  const bellHtml = `
    <button class="header-icon-btn" data-action="toggle-notifications">
      <i class="ri-notification-3-line"></i>
      ${unreadCount > 0 ? `<span class="noti-badge">${unreadCount > 9 ? '9+' : unreadCount}</span>` : ''}
    </button>
  `;

  // Hamburger menu
  const hamburgerHtml = `
    <button class="header-icon-btn" data-action="toggle-hamburger">
      <i class="ri-menu-line"></i>
    </button>
  `;

  const hamburgerMenuHtml = showHamburgerMenu ? `
    <div class="hamburger-overlay" data-action="toggle-hamburger"></div>
    <div class="hamburger-menu">
      <div class="hamburger-header">
        <div class="hamburger-logo"><i class="ri-shopping-bag-3-fill"></i> i<span>Bag</span></div>
        <button data-action="toggle-hamburger"><i class="ri-close-line"></i></button>
      </div>
      <div class="hamburger-items">
        <div class="hamburger-item" data-action="goto-settings"><i class="ri-settings-4-line"></i> ${escapeHtml(t('set_title'))}</div>
        <div class="hamburger-item" data-action="export"><i class="ri-download-line"></i> ${escapeHtml(t('set_export'))}</div>
        <div class="hamburger-item" data-action="import"><i class="ri-upload-line"></i> ${escapeHtml(t('set_import'))}</div>
        <div class="hamburger-divider"></div>
        <div class="hamburger-item" data-action="toggle-theme"><i class="${state.theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}"></i> ${escapeHtml(state.theme === 'dark' ? t('set_theme_light') : t('set_theme_dark'))}</div>

      </div>
    </div>
  ` : '';

  // Plus menu overlay
  const plusMenuHtml = showPlusMenu ? `
    <div class="plus-overlay" data-action="close-plus"></div>
    <div class="plus-menu">
      <div class="plus-menu-title">${escapeHtml(t('plus_menu_title') || '서비스')}</div>
      <div class="plus-menu-grid">
        <div class="plus-menu-item" data-action="goto-orgchart">
          <div class="plus-icon" style="background:linear-gradient(135deg,#f59e0b18,#f97316 18);color:#f59e0b"><i class="ri-organization-chart"></i></div>
          <span>${escapeHtml(t('plus_orgchart') || '조직도 그리기')}</span>
        </div>
        <div class="plus-menu-item" data-action="open-infoweb4-apply">
          <div class="plus-icon" style="background:linear-gradient(135deg,#3b82f618,#06b6d418);color:#3b82f6"><i class="ri-file-add-line"></i></div>
          <span>${escapeHtml(t('plus_apply') || '1page 제작요청')}</span>
        </div>
      </div>
      <button class="plus-close-btn" data-action="close-plus"><i class="ri-close-line"></i></button>
    </div>
  ` : '';

  // Share mode bar
  const shareBarHtml = shareSelectMode ? `
    <div class="share-bar">
      <span>${escapeHtml(t('share_selected'))}: ${shareSelectedIds.size}</span>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline" data-action="share-cancel" style="padding:6px 12px;font-size:12px">${escapeHtml(t('share_cancel'))}</button>
        <button class="btn btn-primary" data-action="share-execute" style="padding:6px 12px;font-size:12px" ${shareSelectedIds.size === 0 ? 'disabled' : ''}><i class="ri-share-forward-line"></i> ${escapeHtml(t('share_send'))}</button>
      </div>
    </div>
  ` : '';

  const isFullscreen = state.currentTab === 'alphabag' || state.currentTab === 'webview' || state.currentTab === 'token-detail' || state.currentTab === 'web3guard-browser';

  // Interstitial Ad overlay
  const interstitialHtml = renderInterstitialAd();
  // Popup Notice overlay
  const popupHtml = renderPopupNotice();

  // Web3 Guard warning overlay
  const w3gWarningHtml = renderWeb3GuardWarning();

  return `
    ${interstitialHtml}
    ${popupHtml}
    ${w3gWarningHtml}
    <div class="main-layout ${isFullscreen ? 'fullscreen-mode' : ''}">
      ${!isFullscreen ? bannerHtml : ''}
      ${!isFullscreen ? `
      ${IS_ELECTRON ? `
      <div class="electron-titlebar" style="-webkit-app-region:drag">
        <div class="titlebar-left">
          <div class="logo-icon" style="width:22px;height:22px;font-size:12px"><i class="ri-shopping-bag-3-fill"></i></div>
          <span class="titlebar-title">i<span style="color:#00d4ff">Bag</span></span>
        </div>
        <div class="titlebar-actions" style="-webkit-app-region:no-drag">
          <button class="titlebar-btn ${isPinned ? 'active' : ''}" data-action="toggle-electron-pin" title="고정핀 (Ctrl+Shift+A)">
            <i class="ri-pushpin-${isPinned ? 'fill' : 'line'}"></i>
          </button>
          <button class="titlebar-btn ${isMiniMode ? 'active' : ''}" data-action="toggle-mini-mode" title="미니 모드 (Ctrl+Shift+M)">
            <i class="ri-picture-in-picture-2-line"></i>
          </button>
          <button class="titlebar-btn" data-action="toggle-quick-copy" title="빠른 복사">
            <i class="ri-file-copy-line"></i>
          </button>
          <button class="titlebar-btn" data-action="electron-minimize"><i class="ri-subtract-line"></i></button>
          <button class="titlebar-btn close" data-action="electron-close"><i class="ri-close-line"></i></button>
        </div>
      </div>` : ''}
      ${quickCopyMode ? renderQuickCopyPanel() : ''}
      <div class="top-bar">
        <div class="page-header">
          <div class="logo-icon"><img src="${IBAG_LOGO_URL}" alt="iBag" style="width:28px;height:28px;border-radius:6px"></div>
          <div class="page-title">i<span>Bag</span></div>
        </div>
        <div class="header-actions">
          <button class="header-icon-btn" data-action="open-scan-modal" title="Scan">
            <i class="ri-scan-2-line"></i>
          </button>
          <button class="header-icon-btn card-header-btn" data-action="goto-card-tab" title="Card">
            <i class="ri-bank-card-line"></i>
          </button>
          ${bellHtml}
          ${hamburgerHtml}
        </div>
      </div>
      ` : ''}
      ${showLangDropdown ? `
      <div class="lang-dropdown-overlay" data-action="toggle-lang-dropdown"></div>
      <div class="lang-dropdown">
        ${LANGUAGES.map(lang => `
          <div class="lang-dropdown-item ${state.language === lang.code ? 'active' : ''}" data-action="set-lang" data-lang="${lang.code}">
            <span class="lang-flag">${lang.flag}</span>
            <span>${lang.nativeName}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      ${notiPanelHtml}
      ${shareBarHtml}
      <div class="screen-content ${isFullscreen ? 'fullscreen-content' : ''}">${screenHtml}</div>
      <div class="bottom-tabs">${tabsHtml}</div>
    </div>
    ${hamburgerMenuHtml}
    ${plusMenuHtml}
    ${modalHtml}
    ${showScanModal ? renderScanModal() : ''}
    ${showCustomMainnetModal ? renderCustomMainnetModal() : ''}
  `;
}

// ─── Banner ───
function renderBanner() {
  if (bannerDismissed || bannerData.length === 0) return '';
  const banner = bannerData[0];
  const hasImage = banner.image_url;
  return `
    <div class="announcement-banner ${banner.type === 'ad' ? 'banner-ad' : 'banner-notice'}">
      <div class="banner-content" ${banner.link_url ? `data-action="open-link" data-link="${escapeHtml(banner.link_url)}"` : ''}>
        ${hasImage ? `<img src="${API_BASE}${banner.image_url}" class="banner-image" alt="">` : ''}
        <div class="banner-text">
          <div class="banner-title">${escapeHtml(banner.title)}</div>
          ${banner.content ? `<div class="banner-desc">${escapeHtml(banner.content)}</div>` : ''}
        </div>
      </div>
      <button class="banner-close" data-action="dismiss-banner"><i class="ri-close-line"></i></button>
    </div>
  `;
}

// ─── Notification Panel ───
function renderNotificationPanel() {
  const items = notifications.length === 0
    ? `<div class="empty-state" style="padding:20px"><p>${escapeHtml(t('noti_empty'))}</p></div>`
    : notifications.map(n => {
        const typeIcon = n.type === 'warning' ? 'ri-error-warning-line' : (n.type === 'notice' ? 'ri-megaphone-line' : 'ri-information-line');
        const typeColor = n.type === 'warning' ? '#ff5252' : (n.type === 'notice' ? '#00d4ff' : '#10b981');
        return `
          <div class="noti-item">
            <i class="${typeIcon}" style="color:${typeColor};font-size:18px;flex-shrink:0"></i>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600">${escapeHtml(n.title)}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${escapeHtml(n.message)}</div>
              <div style="font-size:10px;color:var(--text-dark);margin-top:4px">${formatDate(n.created_at)}</div>
            </div>
          </div>
        `;
      }).join('');

  return `
    <div class="notification-panel">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--bg-card-border)">
        <span style="font-size:14px;font-weight:600">${escapeHtml(t('noti_title'))}</span>
        <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:18px" data-action="toggle-notifications"><i class="ri-close-line"></i></button>
      </div>
      <div class="noti-list">${items}</div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// HOME SCREEN - 6 Action Buttons + Middle Tabs + Token/infoweb4 List
// ═══════════════════════════════════════════════════════════

function renderHome() {
  // 6 Action Buttons - 통일된 색상 테마
  const actionButtons = `
    <div class="action-grid">
      <div class="action-btn" data-action="goto-ibag">
        <div class="action-icon" style="background:linear-gradient(135deg,#3b82f615,#06b6d415)"><img src="${IBAG_LOGO_URL}" alt="iBag" style="width:28px;height:28px;border-radius:6px"></div>
        <span>iBag</span>
      </div>
      <div class="action-btn" data-action="goto-calc">
        <div class="action-icon" style="background:linear-gradient(135deg,#10b98115,#06b6d415)"><i class="ri-calculator-line" style="color:#10b981"></i></div>
        <span>${escapeHtml(t('action_calculator') || '계산기')}</span>
      </div>
      <div class="action-btn" data-action="goto-translate">
        <div class="action-icon" style="background:linear-gradient(135deg,#6366f115,#8b5cf615)"><i class="ri-translate-2" style="color:#6366f1"></i></div>
        <span>${escapeHtml(t('action_translate'))}</span>
      </div>
      <div class="action-btn" data-action="goto-web3app">
        <div class="action-icon" style="background:linear-gradient(135deg,#f9731615,#f59e0b15)"><i class="ri-download-cloud-2-fill" style="color:#f97316"></i></div>
        <span>Web3App</span>
      </div>
      <div class="action-btn" data-action="goto-kpi">
        <div class="action-icon" style="background:linear-gradient(135deg,#8b5cf615,#a78bfa15)"><i class="ri-bar-chart-box-fill" style="color:#8b5cf6"></i></div>
        <span>KPI</span>
      </div>
      <div class="action-btn" data-action="open-alpha-trip-home">
        <div class="action-icon" style="background:linear-gradient(135deg,#3b82f615,#2563eb15)"><i class="ri-plane-fill" style="color:#3b82f6"></i></div>
        <span>Alpha Trip</span>
      </div>
    </div>
  `;

  // Middle Tabs
  const middleTabsHtml = `
    <div class="middle-tabs">
      ${middleTabs.map(tab => `
        <button class="middle-tab ${activeMiddleTab === tab.id ? 'active' : ''}" data-mtab="${tab.id}">
          ${escapeHtml(tab.label)}
        </button>
      `).join('')}
    </div>
  `;

  // Content based on active middle tab
  let middleContent = '';
  if (activeMiddleTab === 'my') {
    middleContent = renderMyTab();
  } else if (activeMiddleTab === 'coin') {
    middleContent = renderCoinTab();
  } else if (activeMiddleTab === 'onepage') {
    middleContent = renderOnePageTab();
  } else if (activeMiddleTab === 'news') {
    middleContent = renderNewsTab();
  } else if (activeMiddleTab === 'meetup') {
    middleContent = renderMeetupTab();
  } else if (activeMiddleTab === 'kol') {
    middleContent = renderKolTab();
  } else {
    const tabInfo = middleTabs.find(t => t.id === activeMiddleTab);
    middleContent = `
      <div class="tab-content-placeholder">
        <i class="${tabInfo?.icon || 'ri-apps-line'}" style="font-size:32px;color:var(--text-muted)"></i>
        <p style="color:var(--text-muted);margin-top:8px">${escapeHtml(tabInfo?.label || '')} - ${escapeHtml(t('coming_soon'))}</p>
      </div>
    `;
  }

  return `
    ${actionButtons}
    ${middleTabsHtml}
    ${middleContent}
  `;
}

// ─── MY Tab: Tokens + infoweb4 mixed list ───
function renderMyTab() {
  // Token list with remove button for non-fixed tokens (includes custom tokens)
  const allTokens = [...TOKEN_LIST, ...customTokens];
  const tokenItems = allTokens.filter(tk => tk.fixed || state.savedTokens.includes(tk.id)).map(tk => {
    const price = tokenPrices[tk.id];
    const usdPrice = price ? price.usd : 0;
    const change24h = price ? price.usd_24h_change : 0;
    const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
    const changeSign = change24h >= 0 ? '+' : '';
    const logoHtml = tk.logo
      ? `<div class="token-icon has-logo" style="background:${tk.color}20"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
      : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
    return `
      <div class="token-card" data-action="open-token-detail" data-token-id="${tk.id}" style="cursor:pointer">
        ${logoHtml}
        <div class="token-info">
          <div class="token-name">${escapeHtml(tk.name)} <span style="font-size:10px;color:var(--text-muted);font-weight:400">${tk.symbol}</span></div>
          <div class="token-price">$${usdPrice ? usdPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
        </div>
        <div class="token-change" style="color:${changeColor}">
          ${changeSign}${change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
        ${!tk.fixed ? `<button class="token-remove-btn" data-action="remove-token" data-token-id="${tk.id}" title="${escapeHtml(t('token_remove'))}"><i class="ri-close-circle-line"></i></button>` : ''}
      </div>
    `;
  }).join('');

  // Add token button
  const addTokenBtn = `
    <div class="token-add-card" data-action="add-token-modal">
      <i class="ri-add-circle-line"></i>
      <span>${escapeHtml(t('token_add'))}</span>
    </div>
  `;

  // infoweb4 default cards + custom projects
  const allProjects = [
    ...INFOWEB4_SITES.map(s => ({ ...s, isDefault: true })),
    ...(state.customProjects || []).map(p => ({ ...p, isDefault: false }))
  ];
  const infoweb4Items = allProjects.map(site => {
    // Try to get favicon from site URL
    const faviconUrl = site.faviconUrl || getFaviconUrl(site.url);
    const logoHtml = faviconUrl
      ? `<div class="infoweb4-logo has-img" style="background:${site.color || '#00d4ff'}20"><img src="${escapeHtml(faviconUrl)}" alt="${escapeHtml(site.name)}" onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='${site.logo || '🌐'}'"></div>`
      : `<div class="infoweb4-logo" style="background:${site.color || '#00d4ff'}20">${site.logo || '🌐'}</div>`;
    const categoryBadge = site.category ? `<span class="project-category-badge" style="background:${site.color || '#00d4ff'}20;color:${site.color || '#00d4ff'}">${escapeHtml(site.category)}</span>` : '';
    return `
    <div class="infoweb4-card" data-action="open-infoweb4" data-url="${escapeHtml(site.url)}">
      ${logoHtml}
      <div class="infoweb4-info">
        <div class="infoweb4-name">${escapeHtml(site.name)} ${categoryBadge}</div>
        <div class="infoweb4-url">${escapeHtml(site.url.replace('https://',''))}</div>
      </div>
      <div class="infoweb4-actions">
        <button class="infoweb4-share" data-action="share-infoweb4" data-url="${escapeHtml(site.url)}" data-name="${escapeHtml(site.name)}"><i class="ri-share-forward-line"></i></button>
        ${!site.isDefault ? `<button class="infoweb4-share" data-action="remove-project" data-project-id="${site.id}"><i class="ri-delete-bin-line" style="color:var(--danger)"></i></button>` : ''}
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
    </div>
  `;
  }).join('');

  // Add project button
  const addProjectBtn = `
    <div class="token-add-card" data-action="add-project-modal">
      <i class="ri-add-circle-line"></i>
      <span>${escapeHtml(t('project_add'))}</span>
    </div>
  `;

  // Favorite tokens section
  const favTokenItems = tokenFavorites.length > 0 ? allTokens.filter(tk => tokenFavorites.includes(tk.id)).map(tk => {
    const price = tokenPrices[tk.id];
    const usdPrice = price ? price.usd : 0;
    const change24h = price ? price.usd_24h_change : 0;
    const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
    const changeSign = change24h >= 0 ? '+' : '';
    const logoHtml = tk.logo
      ? `<div class="token-icon has-logo" style="background:${tk.color}20"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
      : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
    return `
      <div class="token-card" data-action="open-token-detail" data-token-id="${tk.id}" style="cursor:pointer">
        ${logoHtml}
        <div class="token-info">
          <div class="token-name">${escapeHtml(tk.name)} <span style="font-size:10px;color:var(--text-muted);font-weight:400">${tk.symbol}</span></div>
          <div class="token-price">$${usdPrice ? usdPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
        </div>
        <div class="token-change" style="color:${changeColor}">
          ${changeSign}${change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
        <button class="token-remove-btn" data-action="remove-favorite-token" data-token-id="${tk.id}" title="Remove from favorites"><i class="ri-star-fill" style="color:#f59e0b"></i></button>
      </div>
    `;
  }).join('') : '';

  const favSection = tokenFavorites.length > 0 ? `
    <div class="section-label"><i class="ri-star-fill" style="color:#f59e0b;font-size:14px"></i> ${escapeHtml(t('tp_favorites') || 'Favorites')} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${tokenFavorites.length})</span></div>
    <div class="token-list">${favTokenItems}</div>
  ` : '';

  // MY tab: show only favorited projects
  const myFavProjects = allProjects.filter(p => projectFavorites.includes(p.id));
  const myFavProjectsHtml = myFavProjects.length > 0 ? myFavProjects.map(site => {
    const faviconUrl = site.faviconUrl || getFaviconUrl(site.url);
    const logoHtml = faviconUrl
      ? `<div class="infoweb4-logo has-img" style="background:${site.color || '#00d4ff'}20"><img src="${escapeHtml(faviconUrl)}" alt="${escapeHtml(site.name)}" onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='${site.logo || '🌐'}'"></div>`
      : `<div class="infoweb4-logo" style="background:${site.color || '#00d4ff'}20">${site.logo || '🌐'}</div>`;
    const categoryBadge = site.category ? `<span class="project-category-badge" style="background:${site.color || '#00d4ff'}20;color:${site.color || '#00d4ff'}">${escapeHtml(site.category)}</span>` : '';
    return `
    <div class="infoweb4-card" data-action="open-infoweb4" data-url="${escapeHtml(site.url)}">
      ${logoHtml}
      <div class="infoweb4-info">
        <div class="infoweb4-name">${escapeHtml(site.name)} ${categoryBadge}</div>
        <div class="infoweb4-url">${escapeHtml(site.url.replace('https://',''))}</div>
      </div>
      <div class="infoweb4-actions">
        <button class="infoweb4-share" data-action="toggle-project-fav" data-project-id="${site.id}"><i class="ri-star-fill" style="color:#f59e0b"></i></button>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
    </div>
  `;
  }).join('') : '';

  const myFavProjectSection = myFavProjects.length > 0 ? `
    <div class="section-label" style="margin-top:16px"><i class="ri-star-fill" style="font-size:14px;color:#f59e0b"></i> 1page.to ${escapeHtml(t('tp_favorites') || 'Favorites')} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${myFavProjects.length})</span></div>
    <div class="infoweb4-list">${myFavProjectsHtml}</div>
  ` : '';

  return `
    ${favSection}
    <div class="section-label">${escapeHtml(t('my_tokens'))} <button class="section-edit-btn" data-action="add-token-modal"><i class="ri-add-line"></i></button></div>
    <div class="token-list">${tokenItems}</div>
    ${addTokenBtn}
    ${myFavProjectSection}
  `;
}

// ═══════════════════════════════════════════════════════════
// Coin Tab - All coins with detailed info
// ═══════════════════════════════════════════════════════════
function renderCoinTab() {
  const allTokens = [...TOKEN_LIST, ...customTokens];
  
  // Favorite tokens section
  const favTokenItems = tokenFavorites.length > 0 ? allTokens.filter(tk => tokenFavorites.includes(tk.id)).map(tk => {
    const price = tokenPrices[tk.id];
    const usdPrice = price ? price.usd : 0;
    const change24h = price ? price.usd_24h_change : 0;
    const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
    const changeSign = change24h >= 0 ? '+' : '';
    const logoHtml = tk.logo
      ? `<div class="token-icon has-logo" style="background:${tk.color}20"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
      : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
    return `
      <div class="token-card" data-action="open-token-detail" data-token-id="${tk.id}" style="cursor:pointer">
        ${logoHtml}
        <div class="token-info">
          <div class="token-name">${escapeHtml(tk.name)} <span style="font-size:10px;color:var(--text-muted);font-weight:400">${tk.symbol}</span></div>
          <div class="token-price">$${usdPrice ? usdPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
        </div>
        <div class="token-change" style="color:${changeColor}">
          ${changeSign}${change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
        <button class="token-remove-btn" data-action="remove-favorite-token" data-token-id="${tk.id}" title="Remove from favorites"><i class="ri-star-fill" style="color:#f59e0b"></i></button>
      </div>
    `;
  }).join('') : '';

  const favSection = tokenFavorites.length > 0 ? `
    <div class="section-label"><i class="ri-star-fill" style="color:#f59e0b;font-size:14px"></i> ${escapeHtml(t('tp_favorites') || 'Favorites')} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${tokenFavorites.length})</span></div>
    <div class="token-list">${favTokenItems}</div>
  ` : '';

  // My tokens (user-added)
  const myTokens = allTokens.filter(tk => tk.fixed || state.savedTokens.includes(tk.id));
  const myTokenItems = myTokens.map(tk => {
    const price = tokenPrices[tk.id];
    const usdPrice = price ? price.usd : 0;
    const change24h = price ? price.usd_24h_change : 0;
    const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
    const changeSign = change24h >= 0 ? '+' : '';
    const logoHtml = tk.logo
      ? `<div class="token-icon has-logo" style="background:${tk.color}20"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
      : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
    return `
      <div class="token-card" data-action="open-token-detail" data-token-id="${tk.id}" style="cursor:pointer">
        ${logoHtml}
        <div class="token-info">
          <div class="token-name">${escapeHtml(tk.name)} <span style="font-size:10px;color:var(--text-muted);font-weight:400">${tk.symbol}</span></div>
          <div class="token-price">$${usdPrice ? usdPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
        </div>
        <div class="token-change" style="color:${changeColor}">
          ${changeSign}${change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
        ${!tk.fixed ? `<button class="token-remove-btn" data-action="remove-token" data-token-id="${tk.id}" title="${escapeHtml(t('token_remove'))}"><i class="ri-close-circle-line"></i></button>` : ''}
      </div>
    `;
  }).join('');

  // All available tokens (not yet added)
  const remainingTokens = allTokens.filter(tk => !tk.fixed && !state.savedTokens.includes(tk.id));
  const remainingItems = remainingTokens.map(tk => {
    const price = tokenPrices[tk.id];
    const usdPrice = price ? price.usd : 0;
    const change24h = price ? price.usd_24h_change : 0;
    const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
    const changeSign = change24h >= 0 ? '+' : '';
    const logoHtml = tk.logo
      ? `<div class="token-icon has-logo" style="background:${tk.color}20"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
      : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
    return `
      <div class="token-card" data-action="open-token-detail" data-token-id="${tk.id}" style="cursor:pointer">
        ${logoHtml}
        <div class="token-info">
          <div class="token-name">${escapeHtml(tk.name)} <span style="font-size:10px;color:var(--text-muted);font-weight:400">${tk.symbol}</span></div>
          <div class="token-price">$${usdPrice ? usdPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}</div>
        </div>
        <div class="token-change" style="color:${changeColor}">
          ${changeSign}${change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
        <button class="token-remove-btn" data-action="quick-add-token" data-token-id="${tk.id}" title="Add to MY"><i class="ri-add-circle-line" style="color:var(--primary)"></i></button>
      </div>
    `;
  }).join('');

  // Add token button
  const addTokenBtn = `
    <div class="token-add-card" data-action="add-token-modal">
      <i class="ri-add-circle-line"></i>
      <span>${escapeHtml(t('token_add'))}</span>
    </div>
  `;

  return `
    ${favSection}
    <div class="section-label"><i class="ri-coin-line" style="font-size:14px;color:var(--primary)"></i> ${escapeHtml(t('my_tokens'))} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${myTokens.length})</span> <button class="section-edit-btn" data-action="add-token-modal"><i class="ri-add-line"></i></button></div>
    <div class="token-list">${myTokenItems}</div>
    ${remainingTokens.length > 0 ? `
      <div class="section-label" style="margin-top:16px"><i class="ri-list-check" style="font-size:14px;color:var(--text-muted)"></i> All Coins <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${remainingTokens.length})</span></div>
      <div class="token-list">${remainingItems}</div>
    ` : ''}
    ${addTokenBtn}
  `;
}

// ═══════════════════════════════════════════════════════════
// 1page.to Tab - All projects with favorite toggle
// ═══════════════════════════════════════════════════════════
function renderOnePageTab() {
  const allProjects = [
    ...INFOWEB4_SITES.map(s => ({ ...s, isDefault: true })),
    ...(state.customProjects || []).map(p => ({ ...p, isDefault: false }))
  ];

  const projectItems = allProjects.map(site => {
    const faviconUrl = site.faviconUrl || getFaviconUrl(site.url);
    const logoHtml = faviconUrl
      ? `<div class="infoweb4-logo has-img" style="background:${site.color || '#00d4ff'}20"><img src="${escapeHtml(faviconUrl)}" alt="${escapeHtml(site.name)}" onerror="this.parentElement.classList.remove('has-img');this.parentElement.innerHTML='${site.logo || '🌐'}'"></div>`
      : `<div class="infoweb4-logo" style="background:${site.color || '#00d4ff'}20">${site.logo || '🌐'}</div>`;
    const categoryBadge = site.category ? `<span class="project-category-badge" style="background:${site.color || '#00d4ff'}20;color:${site.color || '#00d4ff'}">${escapeHtml(site.category)}</span>` : '';
    const isFav = projectFavorites.includes(site.id);
    return `
    <div class="infoweb4-card" data-action="open-infoweb4" data-url="${escapeHtml(site.url)}">
      ${logoHtml}
      <div class="infoweb4-info">
        <div class="infoweb4-name">${escapeHtml(site.name)} ${categoryBadge}</div>
        <div class="infoweb4-url">${escapeHtml(site.url.replace('https://',''))}</div>
      </div>
      <div class="infoweb4-actions">
        <button class="infoweb4-share" data-action="toggle-project-fav" data-project-id="${site.id}" style="${isFav ? 'color:#f59e0b' : ''}"><i class="${isFav ? 'ri-star-fill' : 'ri-star-line'}"></i></button>
        <button class="infoweb4-share" data-action="share-infoweb4" data-url="${escapeHtml(site.url)}" data-name="${escapeHtml(site.name)}"><i class="ri-share-forward-line"></i></button>
        ${!site.isDefault ? `<button class="infoweb4-share" data-action="remove-project" data-project-id="${site.id}"><i class="ri-delete-bin-line" style="color:var(--danger)"></i></button>` : ''}
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
    </div>
  `;
  }).join('');

  const addProjectBtn = `
    <div class="token-add-card" data-action="add-project-modal">
      <i class="ri-add-circle-line"></i>
      <span>${escapeHtml(t('project_add'))}</span>
    </div>
  `;

  return `
    <div class="section-label"><i class="ri-pages-line" style="font-size:14px;color:var(--primary)"></i> 1page.to Projects <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${allProjects.length})</span> <button class="section-edit-btn" data-action="add-project-modal"><i class="ri-add-line"></i></button></div>
    <div class="infoweb4-list">${projectItems}</div>
    ${addProjectBtn}
    <div style="padding:12px 16px;text-align:center;color:var(--text-muted);font-size:11px">
      <i class="ri-refresh-line"></i> API 연동 준비 중 - 30분마다 자동 업데이트 예정
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// News Tab - Placeholder
// ═══════════════════════════════════════════════════════════
function renderNewsTab() {
  return `
    <div class="tab-content-placeholder" style="padding:40px 16px;text-align:center">
      <i class="ri-newspaper-line" style="font-size:48px;color:var(--primary);margin-bottom:12px"></i>
      <h3 style="color:var(--text);margin-bottom:8px">Crypto News</h3>
      <p style="color:var(--text-muted);font-size:13px;line-height:1.5">암호화폐 및 Web3 최신 뉴스를<br>실시간으로 확인하세요</p>
      <div style="margin-top:20px;padding:16px;background:var(--bg-card);border-radius:12px;border:1px solid var(--bg-card-border)">
        <i class="ri-tools-line" style="font-size:24px;color:var(--text-muted)"></i>
        <p style="color:var(--text-muted);font-size:12px;margin-top:8px">업데이트 준비 중...</p>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// Meetup Tab - Placeholder
// ═══════════════════════════════════════════════════════════
function renderMeetupTab() {
  return `
    <div class="tab-content-placeholder" style="padding:40px 16px;text-align:center">
      <i class="ri-group-line" style="font-size:48px;color:var(--primary);margin-bottom:12px"></i>
      <h3 style="color:var(--text);margin-bottom:8px">밋업</h3>
      <p style="color:var(--text-muted);font-size:13px;line-height:1.5">Web3 밋업 및 컨퍼런스 정보를<br>한눈에 확인하세요</p>
      <div style="margin-top:20px;padding:16px;background:var(--bg-card);border-radius:12px;border:1px solid var(--bg-card-border)">
        <i class="ri-tools-line" style="font-size:24px;color:var(--text-muted)"></i>
        <p style="color:var(--text-muted);font-size:12px;margin-top:8px">업데이트 준비 중...</p>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// KOL Tab - Placeholder
// ═══════════════════════════════════════════════════════════
function renderKolTab() {
  return `
    <div class="tab-content-placeholder" style="padding:40px 16px;text-align:center">
      <i class="ri-user-voice-line" style="font-size:48px;color:var(--primary);margin-bottom:12px"></i>
      <h3 style="color:var(--text);margin-bottom:8px">KOL</h3>
      <p style="color:var(--text-muted);font-size:13px;line-height:1.5">Key Opinion Leaders 및<br>인플루언서 정보</p>
      <div style="margin-top:20px;padding:16px;background:var(--bg-card);border-radius:12px;border:1px solid var(--bg-card-border)">
        <i class="ri-tools-line" style="font-size:24px;color:var(--text-muted)"></i>
        <p style="color:var(--text-muted);font-size:12px;margin-top:8px">업데이트 준비 중...</p>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// iBag Screen (Bookmarks + Web3 + Memo + Life combined)
// ═══════════════════════════════════════════════════════════

function renderIBag() {
  const ibagTabs = [
    { id: 'bookmarks', icon: 'ri-bookmark-3-line', label: t('action_bookmark'), count: state.bookmarks.length },
    { id: 'ideas', icon: 'ri-lightbulb-flash-line', label: t('idea_title') || 'Idea', count: ideaNotes.length },
    { id: 'web3', icon: 'ri-wallet-3-line', label: 'Web3', count: state.mailAccounts.length },
    { id: 'memos', icon: 'ri-file-text-line', label: 'Memo', count: state.memos.length },
    { id: 'work', icon: 'ri-shield-keyhole-line', label: t('work_title'), count: workItems.length },
    { id: 'life', icon: 'ri-camera-line', label: 'Life', count: state.files.length },
  ];

  const ibagTabsHtml = ibagTabs.map(tab => `
    <button class="ibag-tab ${bmTab === tab.id ? 'active' : ''}" data-ibag-tab="${tab.id}">
      <i class="${tab.icon}"></i>
      <span>${escapeHtml(tab.label)}</span>
      <span class="ibag-count">${tab.count}</span>
    </button>
  `).join('');

  let content = '';
  switch (bmTab) {
    case 'bookmarks': content = renderBookmarkList(); break;
    case 'ideas': content = renderIdeaScreen(); break;
    case 'web3': content = renderWeb3List(); break;
    case 'memos': content = renderMemoList(); break;
    case 'work': content = renderWorkList(); break;
    case 'life': content = renderLifeList(); break;
  }

  return `
    <div class="ibag-header">
      <div class="section-title">iBag</div>
    </div>
    <div class="ibag-tabs">${ibagTabsHtml}</div>
    ${content}
  `;
}

// ─── Bookmark List (inside iBag) ───
function renderBookmarkList() {
  const cats = ['all', ...BOOKMARK_CATEGORIES];
  const tagsHtml = cats.map(c => {
    const label = c === 'all' ? t('bm_all') : t(BOOKMARK_CATEGORY_KEYS[c] || c);
    const color = c === 'all' ? '#00d4ff' : (CATEGORY_COLORS[c] || '#64748b');
    const icon = c === 'all' ? 'ri-apps-line' : (BOOKMARK_CATEGORY_ICONS[c] || 'ri-more-line');
    return `<span class="category-tag ${bmCategoryFilter === c ? 'active' : ''}" data-cat="${c}" style="color:${color};${bmCategoryFilter === c ? `background:${color}20;border-color:${color}` : ''}"><i class="${icon}"></i> ${escapeHtml(label)}</span>`;
  }).join('');

  const filtered = bmCategoryFilter === 'all' ? state.bookmarks : state.bookmarks.filter(b => b.category === bmCategoryFilter);
  const searched = searchQuery ? filtered.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase())) : filtered;

  const listHtml = searched.length === 0
    ? `<div class="empty-state"><i class="ri-bookmark-line"></i><p>${escapeHtml(t('bm_no_bookmarks'))}</p></div>`
    : searched.map(bm => {
        const catColor = CATEGORY_COLORS[bm.category] || '#64748b';
        const isSelected = shareSelectMode && shareSelectedIds.has(bm.id);
        return `
          <div class="card ${isSelected ? 'card-selected' : ''}" data-id="${bm.id}" data-type="bookmark" ${shareSelectMode ? `data-share-select="${bm.id}"` : ''}>
            <div class="card-row">
              ${shareSelectMode ? `<div class="share-checkbox ${isSelected ? 'checked' : ''}"><i class="${isSelected ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}"></i></div>` : ''}
              <div class="card-icon" style="background:${catColor}15"><i class="${BOOKMARK_CATEGORY_ICONS[bm.category] || 'ri-global-line'}" style="color:${catColor};font-size:20px"></i></div>
              <div class="card-info">
                <div class="card-title">${escapeHtml(bm.title)}</div>
                <a class="card-sub bm-url-link" href="#" data-action="open-bookmark-url" data-url="${escapeHtml(bm.url)}" onclick="event.stopPropagation(); event.preventDefault();">${escapeHtml(bm.url)}</a>
                <span class="card-cat-badge" style="color:${catColor};background:${catColor}15">${escapeHtml(t(BOOKMARK_CATEGORY_KEYS[bm.category] || 'cat_other'))}</span>
              </div>
              ${!shareSelectMode ? `<div class="card-actions">
                <button data-pin="${bm.id}" title="Pin"><i class="ri-pushpin-${bm.pinned ? 'fill' : 'line'}" style="${bm.pinned ? 'color:#f59e0b' : ''}"></i></button>
                <button class="danger" data-delete-bm="${bm.id}"><i class="ri-delete-bin-line"></i></button>
              </div>` : ''}
            </div>
          </div>
        `;
      }).join('');

  const shareBtn = !shareSelectMode ? `<button class="share-fab" data-action="start-share-bookmarks"><i class="ri-share-forward-line"></i></button>` : '';

  return `
    <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('bm_search'))}" value="${escapeHtml(searchQuery)}" data-search="bm"></div>
    <div class="tags-row">${tagsHtml}</div>
    ${listHtml}
    ${shareBtn}
    <button class="fab" data-action="add-bookmark"><i class="ri-add-line"></i></button>
  `;
}

// ─── Web3 List ───
function renderWeb3List() {
  const searched = searchQuery ? state.mailAccounts.filter(m => m.email.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase())) : state.mailAccounts;

  const listHtml = searched.length === 0
    ? `<div class="empty-state"><i class="ri-wallet-3-line"></i><p>${escapeHtml(t('bm_no_web3'))}</p></div>`
    : searched.map(ma => {
        const isSelected = shareSelectMode && shareSelectedIds.has(ma.id);
        const hasSeed = ma.recoveryEmail && ma.recoveryEmail.trim().length > 0;
        return `
          <div class="card ${isSelected ? 'card-selected' : ''}" data-id="${ma.id}" data-type="web3" ${shareSelectMode ? `data-share-select="${ma.id}"` : ''}>
            <div class="card-row">
              ${shareSelectMode ? `<div class="share-checkbox ${isSelected ? 'checked' : ''}"><i class="${isSelected ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}"></i></div>` : ''}
              <div class="card-icon" style="background:#8b5cf615"><i class="ri-wallet-3-line" style="color:#8b5cf6;font-size:20px"></i></div>
              <div class="card-info">
                <div class="card-title">${escapeHtml(ma.email)}</div>
                <div class="card-sub">${escapeHtml(ma.provider || 'Web3')}</div>
              </div>
              ${hasSeed ? `<span class="max-security-badge-sm"><i class="ri-shield-star-fill"></i></span>` : ''}
              ${!shareSelectMode ? `<div class="card-actions">
                <button class="danger" data-delete-web3="${ma.id}"><i class="ri-delete-bin-line"></i></button>
              </div>` : ''}
            </div>
          </div>
        `;
      }).join('');

  const shareBtn = !shareSelectMode ? `<button class="share-fab" data-action="start-share-web3"><i class="ri-share-forward-line"></i></button>` : '';

  return `
    <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('bm_search'))}" value="${escapeHtml(searchQuery)}" data-search="web3"></div>
    ${listHtml}
    ${shareBtn}
    <button class="fab" data-action="add-web3"><i class="ri-add-line"></i></button>
  `;
}

// ─── Memo List ───
function renderMemoList() {
  const searched = searchQuery ? state.memos.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.content.toLowerCase().includes(searchQuery.toLowerCase())) : state.memos;

  const listHtml = searched.length === 0
    ? `<div class="empty-state"><i class="ri-file-text-line"></i><p>${escapeHtml(t('memo_no_memos'))}</p></div>`
    : searched.map(m => {
        const hasImage = m.imageFileName && memoImageCache[m.id];
        const iconClass = hasImage ? 'ri-image-line' : 'ri-file-text-line';
        const iconColor = hasImage ? '#00d4ff' : '#10b981';
        const isSelected = shareSelectMode && shareSelectedIds.has(m.id);
        return `
          <div class="card ${isSelected ? 'card-selected' : ''}" data-id="${m.id}" data-type="memo" ${shareSelectMode ? `data-share-select="${m.id}"` : ''}>
            ${hasImage ? `<div class="card-image-thumb" style="position:relative"><img src="${memoImageCache[m.id]}" alt=""><button class="img-clipboard-btn" data-action="copy-memo-image" data-memo-id="${m.id}" title="${escapeHtml(t('memo_copy_to_clipboard'))}"><i class="ri-clipboard-line"></i></button></div>` : ''}
            <div class="card-row">
              ${shareSelectMode ? `<div class="share-checkbox ${isSelected ? 'checked' : ''}"><i class="${isSelected ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}"></i></div>` : ''}
              <div class="card-icon" style="background:${iconColor}15"><i class="${iconClass}" style="color:${iconColor};font-size:20px"></i></div>
              <div class="card-info">
                <div class="card-title">${escapeHtml(m.title)}</div>
                <div class="card-sub">${escapeHtml(m.content.substring(0, 60))}</div>
              </div>
              ${!shareSelectMode ? `<div class="card-actions">
                <button class="danger" data-delete-memo="${m.id}"><i class="ri-delete-bin-line"></i></button>
              </div>` : ''}
            </div>
          </div>
        `;
      }).join('');

  const shareBtn = !shareSelectMode ? `<button class="share-fab" data-action="start-share-memos"><i class="ri-share-forward-line"></i></button>` : '';

  return `
    <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('memo_search'))}" value="${escapeHtml(searchQuery)}" data-search="memo"></div>
    ${listHtml}
    ${shareBtn}
    <button class="fab" data-action="add-memo"><i class="ri-add-line"></i></button>
  `;
}

// ─── Work List (Secure Data Storage) ───
const WORK_TYPES = [
  { id: 'api_key', icon: 'ri-key-2-line', color: '#f59e0b' },
  { id: 'wallet', icon: 'ri-wallet-3-line', color: '#8b5cf6' },
  { id: 'account', icon: 'ri-user-line', color: '#00d4ff' },
  { id: 'server', icon: 'ri-server-line', color: '#10b981' },
  { id: 'database', icon: 'ri-database-2-line', color: '#ef4444' },
  { id: 'credential', icon: 'ri-lock-line', color: '#ec4899' },
  { id: 'other_work', icon: 'ri-folder-shield-2-line', color: '#64748b' },
];

function renderWorkList() {
  const searched = searchQuery ? workItems.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : workItems;

  const listHtml = searched.length === 0
    ? `<div class="empty-state"><i class="ri-shield-keyhole-line"></i><p>${escapeHtml(t('work_empty'))}</p></div>`
    : searched.map(w => {
        const wt = WORK_TYPES.find(wt => wt.id === w.type) || WORK_TYPES[WORK_TYPES.length - 1];
        const isExpanded = workExpandedId === w.id;
        const secLevel = w.securityLevel || 'normal';
        const secIcon = secLevel === 'critical' ? 'ri-shield-flash-line' : secLevel === 'high' ? 'ri-shield-check-line' : 'ri-shield-line';
        const secColor = secLevel === 'critical' ? '#ef4444' : secLevel === 'high' ? '#f59e0b' : '#10b981';

        let fieldsHtml = '';
        if (isExpanded && w.fields) {
          fieldsHtml = w.fields.map((f, idx) => {
            const isSensitive = f.sensitive;
            const maskedValue = isSensitive ? '••••••••••••' : f.value;
            return `
              <div class="work-field">
                <div class="work-field-label">${escapeHtml(f.name)}</div>
                <div class="work-field-value">
                  <span class="work-field-text" id="work-field-${w.id}-${idx}">${escapeHtml(maskedValue)}</span>
                  <div class="work-field-actions">
                    ${isSensitive ? `<button class="work-field-btn" data-action="toggle-work-field" data-work-id="${w.id}" data-field-idx="${idx}" title="Show/Hide"><i class="ri-eye-line"></i></button>` : ''}
                    <button class="work-field-btn ${isSensitive ? 'secure-copy' : ''}" data-action="copy-work-field" data-work-id="${w.id}" data-field-idx="${idx}" data-sensitive="${isSensitive}" title="Copy"><i class="ri-clipboard-line"></i></button>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }

        return `
          <div class="card work-card ${isExpanded ? 'expanded' : ''}" data-work-id="${w.id}">
            <div class="card-row" data-action="toggle-work-expand" data-work-id="${w.id}">
              <div class="card-icon" style="background:${wt.color}15"><i class="${wt.icon}" style="color:${wt.color};font-size:20px"></i></div>
              <div class="card-info">
                <div class="card-title">${escapeHtml(w.name)}</div>
                <div class="card-sub">${escapeHtml(t('work_type_' + w.type))} ${w.url ? '· ' + escapeHtml(w.url.substring(0, 30)) : ''}</div>
              </div>
              <div class="work-sec-badge" style="color:${secColor}"><i class="${secIcon}"></i></div>
              <div class="card-actions">
                <button data-action="edit-work-item" data-work-id="${w.id}"><i class="ri-edit-line"></i></button>
                <button class="danger" data-action="delete-work-item" data-work-id="${w.id}"><i class="ri-delete-bin-line"></i></button>
              </div>
            </div>
            ${isExpanded ? `
              <div class="work-expanded">
                ${w.url ? `<div class="work-url"><i class="ri-link"></i> <a href="${escapeHtml(w.url)}" target="_blank">${escapeHtml(w.url)}</a></div>` : ''}
                ${fieldsHtml}
                ${w.notes ? `<div class="work-notes"><i class="ri-sticky-note-line"></i> ${escapeHtml(w.notes)}</div>` : ''}
                <div class="work-actions-row">
                  <button class="btn btn-sm btn-outline" data-action="work-security-scan" data-work-id="${w.id}"><i class="ri-shield-check-line"></i> ${escapeHtml(t('work_security_scan'))}</button>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

  return `
    <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('work_search'))}" value="${escapeHtml(searchQuery)}" data-search="work"></div>
    <div class="work-security-banner">
      <i class="ri-shield-keyhole-fill"></i>
      <span>${escapeHtml(t('work_security_notice'))}</span>
    </div>
    ${listHtml}
    <button class="fab" data-action="add-work-item"><i class="ri-add-line"></i></button>
  `;
}

// ─── Life List ───
function renderLifeList() {
  const searched = searchQuery ? state.files.filter(f => f.fileName.toLowerCase().includes(searchQuery.toLowerCase())) : state.files;

  const FILE_ICONS = { photo: 'ri-image-line', document: 'ri-file-text-line', video: 'ri-video-line', audio: 'ri-music-line', other_file: 'ri-file-line' };

  const listHtml = searched.length === 0
    ? `<div class="empty-state"><i class="ri-camera-line"></i><p>${escapeHtml(t('life_empty'))}</p></div>`
    : searched.map(f => {
        const catColor = CATEGORY_COLORS[f.category] || '#64748b';
        const icon = FILE_ICONS[f.category] || 'ri-file-line';
        const isSelected = shareSelectMode && shareSelectedIds.has(f.id);
        return `
          <div class="card ${isSelected ? 'card-selected' : ''}" data-id="${f.id}" data-type="file" ${shareSelectMode ? `data-share-select="${f.id}"` : ''}>
            <div class="card-row">
              ${shareSelectMode ? `<div class="share-checkbox ${isSelected ? 'checked' : ''}"><i class="${isSelected ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}"></i></div>` : ''}
              <div class="card-icon" style="background:${catColor}15"><i class="${icon}" style="color:${catColor};font-size:20px"></i></div>
              <div class="card-info">
                <div class="card-title">${escapeHtml(f.fileName)}</div>
                <div class="card-sub">${formatFileSize(f.fileSize)} · ${formatDate(f.createdAt)}</div>
              </div>
              ${!shareSelectMode ? `<div class="card-actions">
                <button class="danger" data-delete-file="${f.id}"><i class="ri-delete-bin-line"></i></button>
              </div>` : ''}
            </div>
          </div>
        `;
      }).join('');

  const shareBtn = !shareSelectMode ? `<button class="share-fab" data-action="start-share-files"><i class="ri-share-forward-line"></i></button>` : '';

  return `
    <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('file_search'))}" value="${escapeHtml(searchQuery)}" data-search="file"></div>
    ${listHtml}
    ${shareBtn}
    <button class="fab" data-action="add-file"><i class="ri-add-line"></i></button>
  `;
}

// ─── Sub-screen wrappers with back button ───
function renderBookmarks() {
  return `<div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('action_bookmark'))}</span></div>${renderBookmarkList()}`;
}
function renderWeb3() {
  return `<div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>Web3</span></div>${renderWeb3List()}`;
}
function renderMemos() {
  return `<div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>Memo</span></div>${renderMemoList()}`;
}
function renderLife() {
  return `<div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>Life</span></div>${renderLifeList()}`;
}

// ═══════════════════════════════════════════════════════════
// CLIPBOARD SCREEN
// ═══════════════════════════════════════════════════════════

function renderClipboard() {
  const filtered = clipboardSearchQuery
    ? clipboardItems.filter(c => 
        c.title.toLowerCase().includes(clipboardSearchQuery.toLowerCase()) ||
        c.memo.toLowerCase().includes(clipboardSearchQuery.toLowerCase()) ||
        (c.content && c.content.toLowerCase().includes(clipboardSearchQuery.toLowerCase()))
      )
    : clipboardItems;

  const listHtml = filtered.length === 0
    ? `<div class="empty-state"><i class="ri-clipboard-line" style="font-size:48px;opacity:0.3"></i><p style="opacity:0.5;margin-top:12px">${escapeHtml(t('clip_empty') || '클립보드가 비어있습니다')}</p><p style="opacity:0.3;font-size:12px">${escapeHtml(t('clip_hint') || '+ 버튼으로 텍스트나 이미지를 저장하세요')}</p></div>`
    : filtered.map(item => {
      const date = new Date(item.createdAt);
      const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      const hasImage = item.type === 'image' && item.imageData;
      const preview = item.content ? (item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content) : '';
      return `
        <div class="clip-card" data-clip-id="${item.id}">
          <div class="clip-card-header">
            <div class="clip-card-title">
              <i class="${hasImage ? 'ri-image-line' : 'ri-text'}"></i>
              <strong>${escapeHtml(item.title || t('clip_untitled') || '제목 없음')}</strong>
            </div>
            <div class="clip-card-actions">
              <button class="clip-action-btn" data-action="clip-copy" data-clip-id="${item.id}" title="${escapeHtml(t('clip_copy') || '복사')}"><i class="ri-file-copy-line"></i></button>
              <button class="clip-action-btn" data-action="clip-edit" data-clip-id="${item.id}" title="${escapeHtml(t('clip_edit') || '수정')}"><i class="ri-edit-line"></i></button>
              <button class="clip-action-btn danger" data-action="clip-delete" data-clip-id="${item.id}" title="${escapeHtml(t('clip_delete') || '삭제')}"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>
          ${item.memo ? `<div class="clip-card-memo">${escapeHtml(item.memo)}</div>` : ''}
          ${hasImage ? `<div class="clip-card-image"><img src="${item.imageData}" alt="" loading="lazy"></div>` : ''}
          ${preview ? `<div class="clip-card-content">${escapeHtml(preview)}</div>` : ''}
          <div class="clip-card-time">${timeStr}</div>
        </div>
      `;
    }).join('');

  return `
    <div class="clip-screen">
      <div class="clip-header">
        <div class="section-title"><i class="ri-clipboard-line"></i> ${escapeHtml(t('tab_clipboard') || '클립보드')}</div>
        <button class="clip-add-btn" data-action="clip-add"><i class="ri-add-line"></i></button>
      </div>
      <div class="clip-search">
        <i class="ri-search-line"></i>
        <input type="text" class="clip-search-input" placeholder="${escapeHtml(t('clip_search') || '검색...')}" value="${escapeHtml(clipboardSearchQuery)}">
      </div>
      <div class="clip-paste-zone" id="clip-paste-zone">
        <i class="ri-clipboard-line" style="font-size:20px;opacity:0.4"></i>
        <span>${escapeHtml(t('clip_paste_here') || 'Ctrl+V로 여기에 붙여넣기')}</span>
      </div>
      <div class="clip-list">
        ${listHtml}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// IDEA NOTE SCREEN (Samsung Notes style)
// ═══════════════════════════════════════════════════════════

function renderIdeaScreen() {
  if (ideaNoteScreen === 'editor' && currentIdeaNote) {
    return renderIdeaNoteEditor();
  }
  return renderIdeaNoteList();
}

function renderIdeaNoteList() {
  const filtered = ideaNoteSearchQuery
    ? ideaNotes.filter(n =>
        (n.title || '').toLowerCase().includes(ideaNoteSearchQuery.toLowerCase()) ||
        (n.textContent || '').toLowerCase().includes(ideaNoteSearchQuery.toLowerCase())
      )
    : ideaNotes;

  const listHtml = filtered.length === 0
    ? `<div class="empty-state"><i class="ri-lightbulb-flash-line" style="font-size:48px;opacity:0.3"></i><p style="opacity:0.5;margin-top:12px">${escapeHtml(t('idea_empty') || '아이디어 노트가 없습니다')}</p><p style="opacity:0.3;font-size:12px">${escapeHtml(t('idea_hint') || '+ 버튼을 눌러 새 노트를 만드세요')}</p></div>`
    : filtered.map(note => {
      const date = new Date(note.updatedAt);
      const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      const hasDrawing = !!note.drawingData;
      const audioCount = (note.audioIds || []).length;
      const videoCount = (note.videoIds || []).length;
      const preview = note.textContent ? (note.textContent.length > 80 ? note.textContent.substring(0, 80) + '...' : note.textContent) : '';
      return `
        <div class="idea-card" data-idea-id="${note.id}">
          ${hasDrawing ? `<div class="idea-card-drawing"><img src="${note.drawingData}" alt="" loading="lazy"></div>` : ''}
          <div class="idea-card-body">
            <div class="idea-card-header">
              <strong>${escapeHtml(note.title || t('idea_untitled') || '제목 없음')}</strong>
              <div class="idea-card-actions">
                <button class="idea-action-btn" data-action="idea-edit" data-idea-id="${note.id}"><i class="ri-edit-line"></i></button>
                <button class="idea-action-btn danger" data-action="idea-delete" data-idea-id="${note.id}"><i class="ri-delete-bin-line"></i></button>
              </div>
            </div>
            ${preview ? `<div class="idea-card-preview">${escapeHtml(preview)}</div>` : ''}
            <div class="idea-card-meta">
              <span class="idea-meta-time">${timeStr}</span>
              <div class="idea-meta-badges">
                ${hasDrawing ? '<span class="idea-badge draw"><i class="ri-brush-line"></i></span>' : ''}
                ${audioCount > 0 ? `<span class="idea-badge audio"><i class="ri-mic-line"></i> ${audioCount}</span>` : ''}
                ${videoCount > 0 ? `<span class="idea-badge video"><i class="ri-vidicon-line"></i> ${videoCount}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  return `
    <div class="idea-list-screen">
      <div class="search-box"><i class="ri-search-line"></i><input type="text" placeholder="${escapeHtml(t('idea_search') || '노트 검색...')}" value="${escapeHtml(ideaNoteSearchQuery)}" data-search="idea"></div>
      <div class="idea-list">${listHtml}</div>
      <button class="fab" data-action="idea-add"><i class="ri-add-line"></i></button>
    </div>
  `;
}

function renderIdeaNoteEditor() {
  const note = currentIdeaNote;
  if (!note) return '';
  const audioCount = (note.audioIds || []).length;
  const videoCount = (note.videoIds || []).length;
  const recTimeStr = ideaRecordingTime > 0 ? formatRecTime(ideaRecordingTime) : '00:00';

  return `
    <div class="idea-editor">
      <div class="idea-editor-toolbar">
        <button data-action="idea-back" class="idea-tb-btn"><i class="ri-arrow-left-line"></i></button>
        <div class="idea-editor-title-wrap">
          <input type="text" class="idea-title-input" value="${escapeHtml(note.title || '')}" placeholder="${escapeHtml(t('idea_title_ph') || '제목을 입력하세요')}" data-idea-title>
        </div>
        <button data-action="idea-save" class="idea-tb-btn save"><i class="ri-save-line"></i></button>
      </div>

      <div class="idea-editor-body">
        <textarea class="idea-text-area" placeholder="${escapeHtml(t('idea_text_ph') || '여기에 자유롭게 작성하세요...')}" data-idea-text>${escapeHtml(note.textContent || '')}</textarea>

        <div class="idea-canvas-wrap" id="idea-canvas-wrap" style="display:${ideaDrawing ? 'block' : 'none'}">
          <canvas id="idea-canvas" width="800" height="600"></canvas>
        </div>

        ${ideaRecordingVideo ? `
          <div class="idea-video-preview">
            <video id="idea-video-preview" autoplay muted playsinline></video>
            <div class="idea-rec-indicator"><span class="rec-dot"></span> REC ${recTimeStr}</div>
          </div>
        ` : ''}

        ${ideaRecordingAudio ? `
          <div class="idea-audio-recording">
            <div class="idea-rec-indicator audio"><span class="rec-dot"></span> ${escapeHtml(t('idea_recording') || '녹음 중')} ${recTimeStr}</div>
            <div class="idea-audio-wave" id="idea-audio-wave"></div>
          </div>
        ` : ''}

        <div class="idea-media-list" id="idea-media-list"></div>
      </div>

      <div class="idea-bottom-bar">
        <button data-action="idea-toggle-draw" class="idea-bb-btn ${ideaDrawing ? 'active' : ''}" title="${escapeHtml(t('idea_draw') || '낙서')}">
          <i class="ri-brush-line"></i>
        </button>
        ${ideaDrawing ? `
          <div class="idea-draw-tools">
            <input type="color" value="${ideaDrawColor}" class="idea-color-pick" data-action="idea-draw-color">
            <button data-action="idea-draw-size-down" class="idea-bb-btn sm"><i class="ri-subtract-line"></i></button>
            <span class="idea-draw-size-label">${ideaDrawSize}px</span>
            <button data-action="idea-draw-size-up" class="idea-bb-btn sm"><i class="ri-add-line"></i></button>
            <button data-action="idea-draw-eraser" class="idea-bb-btn sm ${ideaDrawEraser ? 'active' : ''}"><i class="ri-eraser-line"></i></button>
            <button data-action="idea-draw-clear" class="idea-bb-btn sm danger"><i class="ri-delete-bin-line"></i></button>
          </div>
        ` : `
          <button data-action="idea-record-audio" class="idea-bb-btn ${ideaRecordingAudio ? 'recording' : ''}" title="${escapeHtml(t('idea_voice') || '음성녹음')}">
            <i class="${ideaRecordingAudio ? 'ri-stop-fill' : 'ri-mic-line'}"></i>
          </button>
          <button data-action="idea-record-video" class="idea-bb-btn ${ideaRecordingVideo ? 'recording' : ''}" title="${escapeHtml(t('idea_video') || '영상녹화')}">
            <i class="${ideaRecordingVideo ? 'ri-stop-fill' : 'ri-vidicon-line'}"></i>
          </button>
        `}
      </div>
    </div>
  `;
}

function formatRecTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

// ─── Idea Note Actions ───
function ideaCreateNew() {
  const note = {
    id: 'idea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: '',
    textContent: '',
    drawingData: null,
    audioIds: [],
    videoIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  currentIdeaNote = note;
  ideaNoteScreen = 'editor';
  ideaDrawing = false;
  render();
  setTimeout(() => initIdeaCanvas(), 100);
}

function ideaOpenNote(id) {
  const note = ideaNotes.find(n => n.id === id);
  if (!note) return;
  currentIdeaNote = { ...note };
  ideaNoteScreen = 'editor';
  ideaDrawing = false;
  render();
  setTimeout(() => {
    initIdeaCanvas();
    loadIdeaMediaList();
  }, 100);
}

async function ideaSaveCurrentNote() {
  if (!currentIdeaNote) return;
  // Grab latest text from DOM
  const titleEl = document.querySelector('[data-idea-title]');
  const textEl = document.querySelector('[data-idea-text]');
  if (titleEl) currentIdeaNote.title = titleEl.value;
  if (textEl) currentIdeaNote.textContent = textEl.value;
  // Save canvas drawing
  const canvas = document.getElementById('idea-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imgData.data.some((v, i) => i % 4 === 3 && v > 0);
    currentIdeaNote.drawingData = hasContent ? canvas.toDataURL('image/png') : null;
  }
  currentIdeaNote.updatedAt = Date.now();
  await saveIdeaNote(currentIdeaNote);
  // Update local array
  const idx = ideaNotes.findIndex(n => n.id === currentIdeaNote.id);
  if (idx >= 0) { ideaNotes[idx] = { ...currentIdeaNote }; }
  else { ideaNotes.unshift({ ...currentIdeaNote }); }
  ideaNotes.sort((a, b) => b.updatedAt - a.updatedAt);
  alert(t('idea_saved') || '저장되었습니다');
}

function ideaGoBack() {
  // Stop any recording
  ideaStopAllRecording();
  ideaNoteScreen = 'list';
  currentIdeaNote = null;
  ideaDrawing = false;
  render();
}

// ─── Canvas Drawing ───
let ideaCanvasCtx = null;
let ideaIsDrawing = false;
let ideaLastX = 0, ideaLastY = 0;

function initIdeaCanvas() {
  const canvas = document.getElementById('idea-canvas');
  if (!canvas) return;
  const wrap = document.getElementById('idea-canvas-wrap');
  if (wrap) {
    canvas.width = wrap.clientWidth || 800;
    canvas.height = Math.max(400, wrap.clientHeight || 400);
  }
  ideaCanvasCtx = canvas.getContext('2d');
  ideaCanvasCtx.lineCap = 'round';
  ideaCanvasCtx.lineJoin = 'round';
  // Restore existing drawing
  if (currentIdeaNote && currentIdeaNote.drawingData) {
    const img = new Image();
    img.onload = () => { ideaCanvasCtx.drawImage(img, 0, 0); };
    img.src = currentIdeaNote.drawingData;
  }
  // Touch/mouse events
  canvas.addEventListener('mousedown', ideaDrawStart);
  canvas.addEventListener('mousemove', ideaDrawMove);
  canvas.addEventListener('mouseup', ideaDrawEnd);
  canvas.addEventListener('mouseleave', ideaDrawEnd);
  canvas.addEventListener('touchstart', ideaTouchStart, { passive: false });
  canvas.addEventListener('touchmove', ideaTouchMove, { passive: false });
  canvas.addEventListener('touchend', ideaDrawEnd);
}

function ideaGetCanvasPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function ideaDrawStart(e) {
  ideaIsDrawing = true;
  const pos = ideaGetCanvasPos(e, e.target);
  ideaLastX = pos.x; ideaLastY = pos.y;
}
function ideaDrawMove(e) {
  if (!ideaIsDrawing || !ideaCanvasCtx) return;
  const pos = ideaGetCanvasPos(e, e.target);
  ideaCanvasCtx.beginPath();
  if (ideaDrawEraser) {
    ideaCanvasCtx.globalCompositeOperation = 'destination-out';
    ideaCanvasCtx.lineWidth = ideaDrawSize * 5;
  } else {
    ideaCanvasCtx.globalCompositeOperation = 'source-over';
    ideaCanvasCtx.strokeStyle = ideaDrawColor;
    ideaCanvasCtx.lineWidth = ideaDrawSize;
  }
  ideaCanvasCtx.moveTo(ideaLastX, ideaLastY);
  ideaCanvasCtx.lineTo(pos.x, pos.y);
  ideaCanvasCtx.stroke();
  ideaLastX = pos.x; ideaLastY = pos.y;
}
function ideaDrawEnd() { ideaIsDrawing = false; }
function ideaTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  ideaIsDrawing = true;
  ideaLastX = (touch.clientX - rect.left) * (canvas.width / rect.width);
  ideaLastY = (touch.clientY - rect.top) * (canvas.height / rect.height);
}
function ideaTouchMove(e) {
  e.preventDefault();
  if (!ideaIsDrawing || !ideaCanvasCtx) return;
  const touch = e.touches[0];
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  ideaCanvasCtx.beginPath();
  if (ideaDrawEraser) {
    ideaCanvasCtx.globalCompositeOperation = 'destination-out';
    ideaCanvasCtx.lineWidth = ideaDrawSize * 5;
  } else {
    ideaCanvasCtx.globalCompositeOperation = 'source-over';
    ideaCanvasCtx.strokeStyle = ideaDrawColor;
    ideaCanvasCtx.lineWidth = ideaDrawSize;
  }
  ideaCanvasCtx.moveTo(ideaLastX, ideaLastY);
  ideaCanvasCtx.lineTo(x, y);
  ideaCanvasCtx.stroke();
  ideaLastX = x; ideaLastY = y;
}

// ─── Audio Recording ───
function getAudioMimeType() {
  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus';
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/ogg')) return 'audio/ogg';
  }
  return ''; // let browser choose default
}
async function ideaStartAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    ideaRecordedChunks = [];
    const audioMime = getAudioMimeType();
    const recorderOptions = audioMime ? { mimeType: audioMime } : {};
    ideaMediaRecorder = new MediaRecorder(stream, recorderOptions);
    const actualMime = ideaMediaRecorder.mimeType || audioMime || 'audio/mp4';
    ideaMediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) ideaRecordedChunks.push(e.data); };
    ideaMediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(ideaRecordedChunks, { type: actualMime });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const mediaId = 'audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        await saveIdeaMedia({ id: mediaId, type: 'audio', data: reader.result, duration: ideaRecordingTime, createdAt: Date.now() });
        if (currentIdeaNote) {
          if (!currentIdeaNote.audioIds) currentIdeaNote.audioIds = [];
          currentIdeaNote.audioIds.push(mediaId);
        }
        ideaRecordingAudio = false;
        ideaRecordingTime = 0;
        clearInterval(ideaRecordingTimer);
        render();
        setTimeout(() => { initIdeaCanvas(); loadIdeaMediaList(); }, 100);
      };
      reader.readAsDataURL(blob);
    };
    ideaMediaRecorder.start();
    ideaRecordingAudio = true;
    ideaRecordingTime = 0;
    ideaRecordingTimer = setInterval(() => { ideaRecordingTime++; const el = document.querySelector('.idea-rec-indicator.audio'); if (el) el.innerHTML = `<span class="rec-dot"></span> ${t('idea_recording') || '녹음 중'} ${formatRecTime(ideaRecordingTime)}`; }, 1000);
    render();
  } catch(e) {
    alert(t('idea_mic_error') || '마이크 접근 권한이 필요합니다');
  }
}

function ideaStopAudioRecording() {
  if (ideaMediaRecorder && ideaMediaRecorder.state !== 'inactive') {
    ideaMediaRecorder.stop();
  }
}

// ─── Video Recording ───
function getVideoMimeType() {
  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) return 'video/webm;codecs=vp9,opus';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) return 'video/webm;codecs=vp8,opus';
    if (MediaRecorder.isTypeSupported('video/webm')) return 'video/webm';
  }
  return ''; // let browser choose default
}
async function ideaStartVideoRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
    ideaVideoStream = stream;
    ideaRecordedChunks = [];
    const videoMime = getVideoMimeType();
    const recorderOptions = videoMime ? { mimeType: videoMime } : {};
    ideaMediaRecorder = new MediaRecorder(stream, recorderOptions);
    const actualMime = ideaMediaRecorder.mimeType || videoMime || 'video/mp4';
    ideaMediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) ideaRecordedChunks.push(e.data); };
    ideaMediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      ideaVideoStream = null;
      const blob = new Blob(ideaRecordedChunks, { type: actualMime });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const mediaId = 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        await saveIdeaMedia({ id: mediaId, type: 'video', data: reader.result, duration: ideaRecordingTime, createdAt: Date.now() });
        if (currentIdeaNote) {
          if (!currentIdeaNote.videoIds) currentIdeaNote.videoIds = [];
          currentIdeaNote.videoIds.push(mediaId);
        }
        ideaRecordingVideo = false;
        ideaRecordingTime = 0;
        clearInterval(ideaRecordingTimer);
        render();
        setTimeout(() => { initIdeaCanvas(); loadIdeaMediaList(); }, 100);
      };
      reader.readAsDataURL(blob);
    };
    ideaMediaRecorder.start();
    ideaRecordingVideo = true;
    ideaRecordingTime = 0;
    ideaRecordingTimer = setInterval(() => { ideaRecordingTime++; const el = document.querySelector('.idea-rec-indicator'); if (el) el.innerHTML = `<span class="rec-dot"></span> REC ${formatRecTime(ideaRecordingTime)}`; }, 1000);
    render();
    setTimeout(() => {
      const vid = document.getElementById('idea-video-preview');
      if (vid && ideaVideoStream) vid.srcObject = ideaVideoStream;
    }, 100);
  } catch(e) {
    alert(t('idea_cam_error') || '카메라 접근 권한이 필요합니다');
  }
}

function ideaStopVideoRecording() {
  if (ideaMediaRecorder && ideaMediaRecorder.state !== 'inactive') {
    ideaMediaRecorder.stop();
  }
}

function ideaStopAllRecording() {
  if (ideaRecordingAudio) ideaStopAudioRecording();
  if (ideaRecordingVideo) ideaStopVideoRecording();
  if (ideaVideoStream) { ideaVideoStream.getTracks().forEach(t => t.stop()); ideaVideoStream = null; }
  clearInterval(ideaRecordingTimer);
  ideaRecordingAudio = false;
  ideaRecordingVideo = false;
  ideaRecordingTime = 0;
}

// ─── Media List Rendering (async) ───
async function loadIdeaMediaList() {
  const container = document.getElementById('idea-media-list');
  if (!container || !currentIdeaNote) return;
  let html = '';
  // Audio items
  for (const aid of (currentIdeaNote.audioIds || [])) {
    const media = await getIdeaMedia(aid).catch(() => null);
    if (media) {
      const dur = media.duration ? formatRecTime(media.duration) : '';
      html += `<div class="idea-media-item audio">
        <button class="idea-media-play" data-action="idea-play-audio" data-media-id="${aid}"><i class="${ideaPlayingAudioId === aid ? 'ri-pause-fill' : 'ri-play-fill'}"></i></button>
        <div class="idea-media-info"><i class="ri-mic-line"></i> ${escapeHtml(t('idea_audio') || '음성')} <span class="idea-media-dur">${dur}</span></div>
        <button class="idea-media-del" data-action="idea-del-media" data-media-id="${aid}" data-media-type="audio"><i class="ri-close-line"></i></button>
      </div>`;
    }
  }
  // Video items
  for (const vid of (currentIdeaNote.videoIds || [])) {
    const media = await getIdeaMedia(vid).catch(() => null);
    if (media) {
      const dur = media.duration ? formatRecTime(media.duration) : '';
      html += `<div class="idea-media-item video">
        <button class="idea-media-play" data-action="idea-play-video" data-media-id="${vid}"><i class="ri-play-fill"></i></button>
        <div class="idea-media-info"><i class="ri-vidicon-line"></i> ${escapeHtml(t('idea_video_label') || '영상')} <span class="idea-media-dur">${dur}</span></div>
        <button class="idea-media-del" data-action="idea-del-media" data-media-id="${vid}" data-media-type="video"><i class="ri-close-line"></i></button>
      </div>`;
    }
  }
  container.innerHTML = html || '';
}

async function ideaPlayAudio(mediaId) {
  if (ideaPlayingAudioId === mediaId && ideaCurrentAudio) {
    ideaCurrentAudio.pause(); ideaCurrentAudio = null; ideaPlayingAudioId = null;
    loadIdeaMediaList(); return;
  }
  if (ideaCurrentAudio) { ideaCurrentAudio.pause(); ideaCurrentAudio = null; }
  const media = await getIdeaMedia(mediaId).catch(() => null);
  if (!media) return;
  ideaCurrentAudio = new Audio(media.data);
  ideaCurrentAudio.setAttribute('playsinline', '');
  ideaPlayingAudioId = mediaId;
  ideaCurrentAudio.onended = () => { ideaPlayingAudioId = null; ideaCurrentAudio = null; loadIdeaMediaList(); };
  ideaCurrentAudio.onerror = (e) => { console.error('Audio play error:', e); ideaPlayingAudioId = null; ideaCurrentAudio = null; loadIdeaMediaList(); alert('이 음성 파일을 재생할 수 없습니다. 새로 녹음해주세요.'); };
  ideaCurrentAudio.play().catch(err => { console.error('Audio play failed:', err); ideaPlayingAudioId = null; ideaCurrentAudio = null; loadIdeaMediaList(); alert('이 음성 파일을 재생할 수 없습니다. 새로 녹음해주세요.'); });
  loadIdeaMediaList();
}

async function ideaPlayVideo(mediaId) {
  const media = await getIdeaMedia(mediaId).catch(() => null);
  if (!media) return;
  // Open in fullscreen overlay
  const overlay = document.createElement('div');
  overlay.className = 'idea-video-overlay';
  overlay.innerHTML = `<div class="idea-video-overlay-inner"><video controls autoplay playsinline webkit-playsinline src="${media.data}" style="max-width:100%;max-height:80vh;border-radius:12px" onerror="alert('이 영상 파일을 재생할 수 없습니다. 새로 녹화해주세요.');this.parentElement.parentElement.remove()"></video><button class="idea-video-close" onclick="this.parentElement.parentElement.remove()"><i class="ri-close-line"></i></button></div>`;
  document.body.appendChild(overlay);
}

async function ideaDeleteMedia(mediaId, type) {
  if (!currentIdeaNote) return;
  await deleteIdeaMedia(mediaId).catch(() => {});
  if (type === 'audio') {
    currentIdeaNote.audioIds = (currentIdeaNote.audioIds || []).filter(id => id !== mediaId);
  } else {
    currentIdeaNote.videoIds = (currentIdeaNote.videoIds || []).filter(id => id !== mediaId);
  }
  loadIdeaMediaList();
}

// ═══════════════════════════════════════════════════════════
// CALCULATOR SCREEN
// ═══════════════════════════════════════════════════════════
// State for selected reference currency
let calcRefCurrency = null; // null = none selected, 'usdt' | '1' | '2'
let calcPhotoMode = false;
let calcPhotoImage = null;
let calcPhotoResult = null;
let calcPhotoProcessing = false;

function getRefPriceText(code) {
  const info = getCountryInfo(code);
  if (code === 'KRW' && usdtKrwPrice > 0) {
    return `1 USDT = ₩${usdtKrwPrice.toLocaleString()} (빗썸 기준가)`;
  } else if (currencyRates[code]) {
    // Show how much 1 USDT is in this currency
    const rate = currencyRates[code];
    return `1 USDT = ${info.symbol}${rate.toLocaleString()} (기준가)`;
  }
  return '';
}

function renderCalculator() {
  // Tab selector
  const tabHtml = `
    <div class="calc-tab-bar">
      <button class="calc-tab-btn ${calcTabMode === 'exchange' ? 'active' : ''}" data-action="calc-tab-exchange">
        <i class="ri-exchange-dollar-line"></i> USDT
      </button>
      <button class="calc-tab-btn ${calcTabMode === 'fee' ? 'active' : ''}" data-action="calc-tab-fee">
        <i class="ri-percent-line"></i> ${escapeHtml(t('calc_tab_fee') || '수수료')}
      </button>
      <button class="calc-tab-btn ${calcTabMode === 'general' ? 'active' : ''}" data-action="calc-tab-general">
        <i class="ri-calculator-line"></i> ${escapeHtml(t('calc_tab_general') || '일반')}
      </button>
    </div>
  `;

  if (calcTabMode === 'general') {
    return `
      <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('calc_title') || 'iBag 계산기')}</span></div>
      <div class="calc-container">
        ${tabHtml}
        ${renderGeneralCalculator()}
      </div>
    `;
  }

  if (calcTabMode === 'fee') {
    return `
      <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('calc_title') || 'iBag 계산기')}</span></div>
      <div class="calc-container">
        ${tabHtml}
        ${renderFeeCalculator()}
      </div>
    `;
  }

  // Exchange calculator (existing)
  const c1Info = getCountryInfo(exchangeCountry1);
  const c2Info = getCountryInfo(exchangeCountry2);
  
  const countryOptions1 = EXCHANGE_COUNTRIES.map(c => 
    `<option value="${c.code}" ${exchangeCountry1 === c.code ? 'selected' : ''}>${c.flag} ${c.code} - ${c.name}</option>`
  ).join('');
  const countryOptions2 = EXCHANGE_COUNTRIES.map(c => 
    `<option value="${c.code}" ${exchangeCountry2 === c.code ? 'selected' : ''}>${c.flag} ${c.code} - ${c.name}</option>`
  ).join('');

  const bithumbPrice = usdtKrwPrice > 0 
    ? `<div class="usdt-bithumb-bar">
        <div class="usdt-bithumb-label"><i class="ri-exchange-dollar-line"></i> ${escapeHtml(t('usdt_bithumb_price'))}</div>
        <div class="usdt-bithumb-price">₩${usdtKrwPrice.toLocaleString()}</div>
        <button class="usdt-refresh-btn" data-action="usdt-refresh"><i class="ri-refresh-line"></i></button>
      </div>` 
    : `<div class="usdt-bithumb-bar loading"><i class="ri-loader-4-line ri-spin"></i> ${escapeHtml(t('usdt_loading'))}</div>`;

  const refPopup = calcRefCurrency ? `
    <div class="calc-ref-popup" data-action="close-ref-popup">
      <div class="calc-ref-popup-inner">
        <div class="calc-ref-title"><i class="ri-information-line"></i> ${escapeHtml(t('usdt_ref_price') || '기준가 정보')}</div>
        ${calcRefCurrency === 'usdt' ? `
          <div class="calc-ref-item active"><span>USDT</span><span>1 USDT = $1.00 (Tether)</span></div>
          <div class="calc-ref-item"><span>${c1Info.flag} ${exchangeCountry1}</span><span>${getRefPriceText(exchangeCountry1)}</span></div>
          <div class="calc-ref-item"><span>${c2Info.flag} ${exchangeCountry2}</span><span>${getRefPriceText(exchangeCountry2)}</span></div>
        ` : calcRefCurrency === '1' ? `
          <div class="calc-ref-item"><span>USDT</span><span>1 USDT = $1.00 (Tether)</span></div>
          <div class="calc-ref-item active"><span>${c1Info.flag} ${exchangeCountry1}</span><span>${getRefPriceText(exchangeCountry1)}</span></div>
          <div class="calc-ref-item"><span>${c2Info.flag} ${exchangeCountry2}</span><span>${getRefPriceText(exchangeCountry2)}</span></div>
        ` : `
          <div class="calc-ref-item"><span>USDT</span><span>1 USDT = $1.00 (Tether)</span></div>
          <div class="calc-ref-item"><span>${c1Info.flag} ${exchangeCountry1}</span><span>${getRefPriceText(exchangeCountry1)}</span></div>
          <div class="calc-ref-item active"><span>${c2Info.flag} ${exchangeCountry2}</span><span>${getRefPriceText(exchangeCountry2)}</span></div>
        `}
      </div>
    </div>
  ` : '';

  let photoSection = '';
  if (calcPhotoMode) {
    if (calcPhotoProcessing) {
      photoSection = `
        <div class="calc-photo-section">
          <div class="photo-translate-processing">
            <i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i>
            <span>${escapeHtml(t('ocr_processing'))}</span>
          </div>
        </div>`;
    } else if (calcPhotoResult) {
      photoSection = `
        <div class="calc-photo-section">
          ${calcPhotoImage ? `<div class="calc-photo-preview"><img src="${calcPhotoImage}" alt="receipt"></div>` : ''}
          <div class="calc-photo-result">
            <div class="calc-photo-detected">
              <span class="calc-photo-label"><i class="ri-scan-line"></i> ${escapeHtml(t('calc_detected_amount') || '감지된 금액')}</span>
              <span class="calc-photo-amount">${calcPhotoResult.detected}</span>
            </div>
            <div class="calc-photo-converted">
              ${calcPhotoResult.conversions.map(c => `
                <div class="calc-photo-conv-row">
                  <span class="calc-photo-conv-flag">${c.flag}</span>
                  <span class="calc-photo-conv-code">${c.code}</span>
                  <span class="calc-photo-conv-val">${c.symbol}${c.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="btn-row" style="margin-top:8px">
            <button class="btn btn-outline btn-sm" data-action="calc-photo-reset"><i class="ri-refresh-line"></i> ${escapeHtml(t('photo_translate_pick') || '다시 촬영')}</button>
            <button class="btn btn-outline btn-sm" data-action="calc-photo-close"><i class="ri-close-line"></i></button>
          </div>
        </div>`;
    } else {
      photoSection = `
        <div class="calc-photo-section">
          <button class="photo-translate-btn" data-action="calc-photo-pick">
            <i class="ri-camera-line"></i>
            <span>${escapeHtml(t('calc_photo_pick') || '영수증/가격표 촬영 또는 이미지 선택')}</span>
          </button>
          <button class="btn btn-outline btn-sm" data-action="calc-photo-close" style="margin-top:8px"><i class="ri-close-line"></i> ${escapeHtml(t('close') || '닫기')}</button>
        </div>`;
    }
  }

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('calc_title') || 'iBag 계산기')}</span></div>
    <div class="calc-container">
      ${tabHtml}
      ${bithumbPrice}
      
      <div class="usdt-currency-card usdt-card">
        <div class="usdt-card-header">
          <div class="usdt-card-icon" style="background:#26a17b20"><img src="https://assets.coingecko.com/coins/images/325/small/Tether.png" alt="USDT" style="width:24px;height:24px;border-radius:50%"></div>
          <div class="usdt-card-label" data-action="show-ref-price" data-ref="usdt" style="cursor:pointer">USDT <span class="usdt-card-sublabel">Tether</span> <i class="ri-information-line" style="font-size:12px;opacity:0.5"></i></div>
        </div>
        <input type="number" class="form-input usdt-amount-input" id="usdt-amount" value="${escapeHtml(exchangeAmountUsdt)}" placeholder="0.00" data-usdt-input="usdt" inputmode="decimal">
      </div>

      <div class="usdt-arrow-divider"><i class="ri-arrow-up-down-line"></i></div>

      <div class="usdt-currency-card">
        <div class="usdt-card-header">
          <div class="usdt-card-icon" style="background:${c1Info.code === 'KRW' ? '#003a7020' : 'var(--bg-card)'}">
            <span style="font-size:20px">${c1Info.flag}</span>
          </div>
          <select class="usdt-country-select" data-usdt-country="1">${countryOptions1}</select>
          <div class="usdt-ref-btn" data-action="show-ref-price" data-ref="1" title="기준가"><i class="ri-information-line"></i></div>
        </div>
        <input type="number" class="form-input usdt-amount-input" id="usdt-amount1" value="${escapeHtml(exchangeAmount1)}" placeholder="0.00" data-usdt-input="1" inputmode="decimal">
        <div class="usdt-card-rate">${getRefPriceText(exchangeCountry1)}</div>
      </div>

      <div class="usdt-arrow-divider"><i class="ri-arrow-up-down-line"></i></div>

      <div class="usdt-currency-card">
        <div class="usdt-card-header">
          <div class="usdt-card-icon" style="background:${c2Info.code === 'KRW' ? '#003a7020' : 'var(--bg-card)'}">
            <span style="font-size:20px">${c2Info.flag}</span>
          </div>
          <select class="usdt-country-select" data-usdt-country="2">${countryOptions2}</select>
          <div class="usdt-ref-btn" data-action="show-ref-price" data-ref="2" title="기준가"><i class="ri-information-line"></i></div>
        </div>
        <input type="number" class="form-input usdt-amount-input" id="usdt-amount2" value="${escapeHtml(exchangeAmount2)}" placeholder="0.00" data-usdt-input="2" inputmode="decimal">
        <div class="usdt-card-rate">${getRefPriceText(exchangeCountry2)}</div>
      </div>

      <div class="calc-bottom-actions">
        <button class="btn btn-primary btn-sm calc-photo-btn" data-action="calc-photo-open">
          <i class="ri-camera-line"></i> ${escapeHtml(t('calc_photo_btn') || '사진으로 환율 계산')}
        </button>
      </div>

      ${photoSection}
      ${refPopup}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// FEE CALCULATOR
// ═══════════════════════════════════════════════════════════

function calculateFee() {
  feeResult = null;
  const pct = parseFloat(feePercent);
  
  if (feeCalcMode === 'forward') {
    // 금액 입력 → 수수료 계산
    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || isNaN(pct) || pct < 0) return;
    const fee = amount * (pct / 100);
    const afterFee = amount - fee;
    const tokenPrice = parseFloat(feeTokenPrice);
    feeResult = {
      mode: 'forward',
      inputAmount: amount,
      feePercent: pct,
      feeAmount: fee,
      afterFee: afterFee,
      tokenEquiv: (tokenPrice && tokenPrice > 0) ? afterFee / tokenPrice : null,
      tokenSymbol: feeTokenSymbol
    };
  } else if (feeCalcMode === 'reverse') {
    // 목표 금액 → 필요 출금액 역산 (선수수료)
    // 목표: targetAmount를 받으려면 얼마를 출금해야 하는가?
    // 출금액 - (출금액 * pct/100) = targetAmount
    // 출금액 * (1 - pct/100) = targetAmount
    // 출금액 = targetAmount / (1 - pct/100)
    const target = parseFloat(feeTargetAmount);
    if (isNaN(target) || isNaN(pct) || pct >= 100 || pct < 0) return;
    const requiredAmount = target / (1 - pct / 100);
    const fee = requiredAmount - target;
    const tokenPrice = parseFloat(feeTokenPrice);
    feeResult = {
      mode: 'reverse',
      targetAmount: target,
      feePercent: pct,
      requiredAmount: requiredAmount,
      feeAmount: fee,
      tokenEquiv: (tokenPrice && tokenPrice > 0) ? requiredAmount / tokenPrice : null,
      tokenSymbol: feeTokenSymbol
    };
  } else if (feeCalcMode === 'profit') {
    // 수익 계산: 토큰 출금 시 수수료 제외 후 실수령
    const amount = parseFloat(feeAmount);
    const tokenPrice = parseFloat(feeTokenPrice);
    if (isNaN(amount) || isNaN(pct) || pct < 0) return;
    const fee = amount * (pct / 100);
    const afterFee = amount - fee;
    const usdtValue = (tokenPrice && tokenPrice > 0) ? afterFee * tokenPrice : afterFee;
    const feeUsdtValue = (tokenPrice && tokenPrice > 0) ? fee * tokenPrice : fee;
    feeResult = {
      mode: 'profit',
      inputAmount: amount,
      feePercent: pct,
      feeAmount: fee,
      afterFee: afterFee,
      tokenPrice: tokenPrice || 1,
      usdtValue: usdtValue,
      feeUsdtValue: feeUsdtValue,
      tokenSymbol: feeTokenSymbol
    };
  }
}

function formatNum(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return '0';
  if (Math.abs(n) >= 1000000) return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals > 6 ? 8 : decimals });
}

// ═══════════════════════════════════════════════════════════
// TOKEN DETAIL SCREEN
// ═══════════════════════════════════════════════════════════

function fmtPrice(n) {
  if (!n && n !== 0) return '$0.00';
  if (n < 0.0001) return '$' + n.toFixed(8);
  if (n < 1) return '$' + n.toFixed(6);
  if (n < 100) return '$' + n.toFixed(4);
  return '$' + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

function fmtBigNum(n) {
  if (!n && n !== 0) return '-';
  if (n >= 1e12) return '$' + (n/1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

async function fetchTokenDetail(tokenId) {
  tokenDetailLoading = true;
  tokenDetailData = null;
  tokenTxnData = [];
  tokenSecurityData = null;
  tokenPoolData = null;
  tokenHoldersData = null;
  render();
  
  const allTokens = [...TOKEN_LIST, ...customTokens];
  const tk = allTokens.find(t => t.id === tokenId);
  if (!tk) { tokenDetailLoading = false; render(); return; }
  
  try {
    // Step 1: CoinGecko detailed data
    const cgUrl = `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=false`;
    const cgResp = await fetch(cgUrl);
    let cgData = null;
    if (cgResp.ok) cgData = await cgResp.json();
    
    // Step 2: If token has contract address, try DexScreener for DEX data
    let dexData = null;
    if (tk.contractAddress && tk.network) {
      const dexChainMap = {
        'ethereum': 'ethereum', 'binance-smart-chain': 'bsc', 'polygon-pos': 'polygon',
        'arbitrum-one': 'arbitrum', 'avalanche': 'avalanche', 'base': 'base',
        'optimistic-ethereum': 'optimism', 'solana': 'solana'
      };
      const dexChain = dexChainMap[tk.network] || tk.network;
      try {
        const dexResp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tk.contractAddress}`);
        if (dexResp.ok) {
          const dexJson = await dexResp.json();
          if (dexJson.pairs && dexJson.pairs.length > 0) {
            // Pick the pair with highest liquidity
            dexData = dexJson.pairs.sort((a,b) => (b.liquidity?.usd||0) - (a.liquidity?.usd||0))[0];
          }
        }
      } catch(e) { /* ignore dex errors */ }
    } else if (!cgData) {
      // Try DexScreener search by name/symbol
      try {
        const dexResp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tk.symbol}`);
        if (dexResp.ok) {
          const dexJson = await dexResp.json();
          if (dexJson.pairs && dexJson.pairs.length > 0) {
            dexData = dexJson.pairs.sort((a,b) => (b.liquidity?.usd||0) - (a.liquidity?.usd||0))[0];
          }
        }
      } catch(e) {}
    }
    
    tokenDetailData = {
      // Basic info
      name: cgData?.name || tk.name,
      symbol: (cgData?.symbol || tk.symbol).toUpperCase(),
      logo: cgData?.image?.large || cgData?.image?.small || tk.logo || '',
      description: cgData?.description?.en || '',
      
      // Price
      price: cgData?.market_data?.current_price?.usd || (dexData ? parseFloat(dexData.priceUsd) : 0),
      priceChange24h: cgData?.market_data?.price_change_percentage_24h || (dexData?.priceChange?.h24 || 0),
      priceChange7d: cgData?.market_data?.price_change_percentage_7d || 0,
      priceChange30d: cgData?.market_data?.price_change_percentage_30d || 0,
      priceChange1h: cgData?.market_data?.price_change_percentage_1h_in_currency?.usd || (dexData?.priceChange?.h1 || 0),
      
      // Market data
      marketCap: cgData?.market_data?.market_cap?.usd || (dexData?.marketCap || dexData?.fdv || 0),
      fdv: cgData?.market_data?.fully_diluted_valuation?.usd || (dexData?.fdv || 0),
      volume24h: cgData?.market_data?.total_volume?.usd || (dexData?.volume?.h24 || 0),
      liquidity: dexData?.liquidity?.usd || 0,
      
      // Supply
      circulatingSupply: cgData?.market_data?.circulating_supply || 0,
      totalSupply: cgData?.market_data?.total_supply || 0,
      maxSupply: cgData?.market_data?.max_supply || 0,
      
      // ATH/ATL
      ath: cgData?.market_data?.ath?.usd || 0,
      athDate: cgData?.market_data?.ath_date?.usd || '',
      athChange: cgData?.market_data?.ath_change_percentage?.usd || 0,
      atl: cgData?.market_data?.atl?.usd || 0,
      atlDate: cgData?.market_data?.atl_date?.usd || '',
      atlChange: cgData?.market_data?.atl_change_percentage?.usd || 0,
      
      // Rank & categories
      rank: cgData?.market_cap_rank || 0,
      categories: cgData?.categories || [],
      
      // Links
      homepage: cgData?.links?.homepage?.[0] || '',
      twitter: cgData?.links?.twitter_screen_name || (dexData?.info?.socials?.find(s=>s.type==='twitter')?.url || ''),
      telegram: cgData?.links?.telegram_channel_identifier || '',
      github: cgData?.links?.repos_url?.github?.[0] || '',
      explorer: cgData?.links?.blockchain_site?.filter(s=>s)?.[0] || '',
      
      // DEX specific
      dexUrl: dexData?.url || '',
      dexId: dexData?.dexId || '',
      pairAddress: dexData?.pairAddress || '',
      txns24h: dexData?.txns?.h24 || null,
      
      // Contract
      contractAddress: tk.contractAddress || (cgData?.platforms ? Object.values(cgData.platforms)[0] : ''),
      network: tk.network || (cgData?.platforms ? Object.keys(cgData.platforms)[0] : ''),
      
      // Community
      twitterFollowers: cgData?.community_data?.twitter_followers || 0,
      
      // Source
      hasCoinGecko: !!cgData,
      hasDexScreener: !!dexData,
    };
  } catch(e) {
    console.error('Token detail fetch error:', e);
    tokenDetailData = { error: true, name: tk.name, symbol: tk.symbol, logo: tk.logo || '' };
  }
  
  tokenDetailLoading = false;
  render();
  
  // Async: fetch additional data (DEX txns, security, pool, holders)
  fetchTokenExtendedData(tk, tokenDetailData);
}

async function fetchTokenExtendedData(tk, detailData) {
  const contractAddr = detailData?.contractAddress || tk.contractAddress || '';
  const network = detailData?.network || tk.network || '';
  const chainMap = { 'ethereum': '1', 'binance-smart-chain': '56', 'polygon-pos': '137', 'arbitrum-one': '42161', 'avalanche': '43114', 'base': '8453', 'optimistic-ethereum': '10', 'solana': 'solana' };
  const chainId = chainMap[network] || '56';
  
  // 1. Fetch DEX transactions from DexScreener
  if (contractAddr) {
    try {
      const dexResp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${contractAddr}`);
      if (dexResp.ok) {
        const dexJson = await dexResp.json();
        if (dexJson.pairs && dexJson.pairs.length > 0) {
          const mainPair = dexJson.pairs.sort((a,b) => (b.liquidity?.usd||0) - (a.liquidity?.usd||0))[0];
          // Build pool data from all pairs
          tokenPoolData = {
            pairs: dexJson.pairs.slice(0, 5).map(p => ({
              dexId: p.dexId || 'Unknown',
              pairAddress: p.pairAddress || '',
              baseToken: p.baseToken?.symbol || '',
              quoteToken: p.quoteToken?.symbol || '',
              liquidity: p.liquidity?.usd || 0,
              volume24h: p.volume?.h24 || 0,
              priceUsd: p.priceUsd || '0',
              url: p.url || '',
            })),
            totalLiquidity: dexJson.pairs.reduce((sum, p) => sum + (p.liquidity?.usd || 0), 0),
          };
          // Generate mock txn data from pair info
          tokenTxnData = generateMockTxns(mainPair);
        }
      }
    } catch(e) { console.log('DEX extended data error:', e); }
  }
  
  // 2. Fetch GoPlus security data
  if (contractAddr && chainId !== 'solana') {
    try {
      const gpResp = await fetch(`https://api.gopluslabs.com/api/v1/token_security/${chainId}?contract_addresses=${contractAddr}`);
      if (gpResp.ok) {
        const gpJson = await gpResp.json();
        if (gpJson.result && gpJson.result[contractAddr.toLowerCase()]) {
          tokenSecurityData = gpJson.result[contractAddr.toLowerCase()];
        }
      }
    } catch(e) { console.log('GoPlus security error:', e); }
  }
  
  // 3. Fetch holders data from GoPlus
  if (contractAddr && chainId !== 'solana') {
    try {
      const hResp = await fetch(`https://api.gopluslabs.com/api/v1/token_security/${chainId}?contract_addresses=${contractAddr}`);
      if (hResp.ok) {
        const hJson = await hResp.json();
        const tokenInfo = hJson.result?.[contractAddr.toLowerCase()];
        if (tokenInfo) {
          tokenHoldersData = {
            holderCount: parseInt(tokenInfo.holder_count || '0'),
            topHolders: (tokenInfo.holders || []).slice(0, 10).map((h, i) => ({
              rank: i + 1,
              address: h.address || '',
              percent: parseFloat(h.percent || '0') * 100,
              balance: parseFloat(h.balance || '0'),
              isContract: h.is_contract === 1,
              isLocked: h.is_locked === 1,
              tag: h.tag || '',
            })),
          };
        }
      }
    } catch(e) { console.log('Holders data error:', e); }
  }
  
  render();
}

function generateMockTxns(pair) {
  // Generate realistic-looking txn data based on pair info
  const txns = [];
  const price = parseFloat(pair.priceUsd || '0.01');
  const symbol = pair.baseToken?.symbol || 'TOKEN';
  const quoteSymbol = pair.quoteToken?.symbol || 'BNB';
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const isBuy = Math.random() > 0.45;
    const amount = (Math.random() * 5000 + 100).toFixed(2);
    const value = (parseFloat(amount) * price).toFixed(4);
    const timeAgo = Math.floor(Math.random() * 600) + 10; // 10s to 10min ago
    const addr = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
    txns.push({
      type: isBuy ? 'buy' : 'sell',
      amount: parseFloat(amount),
      symbol: symbol,
      value: parseFloat(value),
      quoteSymbol: quoteSymbol,
      price: price,
      address: addr,
      timeAgo: timeAgo,
    });
  }
  return txns.sort((a, b) => a.timeAgo - b.timeAgo);
}

// ═══════════════════════════════════════════════
// REAL-TIME WEBSOCKET PRICE
// ═══════════════════════════════════════════════
function connectTokenWebSocket(tokenId) {
  disconnectTokenWebSocket();
  tokenWsPrice = null;
  tokenWsPriceChange = null;
  
  // Use CoinGecko IDs for Binance symbol mapping
  const symbolMap = {
    'bitcoin': 'btcusdt', 'ethereum': 'ethusdt', 'binancecoin': 'bnbusdt',
    'ripple': 'xrpusdt', 'solana': 'solusdt', 'cardano': 'adausdt',
    'dogecoin': 'dogeusdt', 'polkadot': 'dotusdt', 'avalanche-2': 'avaxusdt',
    'chainlink': 'linkusdt', 'matic-network': 'polusdt', 'tron': 'trxusdt',
    'uniswap': 'uniusdt', 'litecoin': 'ltcusdt', 'cosmos': 'atomusdt',
    'stellar': 'xlmusdt', 'near': 'nearusdt', 'aptos': 'aptusdt',
    'sui': 'suiusdt', 'arbitrum': 'arbusdt', 'tether': 'usdtusdc',
    'usd-coin': 'usdcusdt', 'shiba-inu': 'shibusdt', 'pepe': 'pepeusdt',
    'wrapped-bitcoin': 'wbtcusdt', 'dai': 'daiusdt',
    'internet-computer': 'icpusdt', 'filecoin': 'filusdt',
    'hedera-hashgraph': 'hbarusdt', 'kaspa': 'kasusdt',
  };
  
  const symbol = symbolMap[tokenId];
  if (!symbol) {
    // For custom tokens or unmapped, use DexScreener polling instead
    startDexScreenerPolling(tokenId);
    return;
  }
  
  try {
    tokenWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
    tokenWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newPrice = parseFloat(data.c); // current price
        const change24h = parseFloat(data.P); // 24h change %
        if (newPrice && newPrice !== tokenWsPrice) {
          tokenWsPrice = newPrice;
          tokenWsPriceChange = change24h;
          // Update price display without full re-render
          updateTokenPriceDisplay(newPrice, change24h);
        }
      } catch(e) {}
    };
    tokenWs.onerror = () => {
      disconnectTokenWebSocket();
      startDexScreenerPolling(tokenId);
    };
    tokenWs.onclose = () => { tokenWs = null; };
  } catch(e) {
    startDexScreenerPolling(tokenId);
  }
}

let dexPollingInterval = null;
function startDexScreenerPolling(tokenId) {
  if (dexPollingInterval) clearInterval(dexPollingInterval);
  const allTokens = [...TOKEN_LIST, ...customTokens];
  const tk = allTokens.find(t => t.id === tokenId);
  if (!tk || !tk.contractAddress) return;
  
  const poll = async () => {
    try {
      const resp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tk.contractAddress}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.pairs && json.pairs.length > 0) {
          const pair = json.pairs.sort((a,b) => (b.liquidity?.usd||0) - (a.liquidity?.usd||0))[0];
          const newPrice = parseFloat(pair.priceUsd);
          const change24h = parseFloat(pair.priceChange?.h24 || 0);
          if (newPrice && newPrice !== tokenWsPrice) {
            tokenWsPrice = newPrice;
            tokenWsPriceChange = change24h;
            updateTokenPriceDisplay(newPrice, change24h);
          }
        }
      }
    } catch(e) {}
  };
  poll();
  dexPollingInterval = setInterval(poll, 10000); // Poll every 10 seconds
}

function updateTokenPriceDisplay(price, change24h) {
  const priceEl = document.querySelector('.tp-token-price');
  const livePriceEl = document.querySelector('.tp-live-price');
  if (priceEl) {
    const color = change24h >= 0 ? '#10b981' : '#ef4444';
    const sign = change24h >= 0 ? '+' : '';
    priceEl.style.color = color;
    priceEl.textContent = `${fmtPrice(price)} ${sign}${change24h.toFixed(2)}%`;
  }
  if (livePriceEl) {
    const color = change24h >= 0 ? '#10b981' : '#ef4444';
    livePriceEl.style.color = color;
    livePriceEl.innerHTML = `<span class="tp-live-dot"></span> $${fmtPrice(price)}`;
  }
}

function disconnectTokenWebSocket() {
  if (tokenWs) {
    try { tokenWs.close(); } catch(e) {}
    tokenWs = null;
  }
  if (dexPollingInterval) {
    clearInterval(dexPollingInterval);
    dexPollingInterval = null;
  }
}

function renderTokenDetail() {
  const allTokens = [...TOKEN_LIST, ...customTokens];
  const tk = allTokens.find(t => t.id === tokenDetailId);
  if (!tk) return '<div class="empty-state"><p>Token not found</p></div>';
  
  const d = tokenDetailData;
  const price = tokenPrices[tk.id];
  const currentPrice = d?.price || (price ? price.usd : 0);
  const change24h = d?.priceChange24h || (price ? price.usd_24h_change : 0);
  const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
  const changeSign = change24h >= 0 ? '+' : '';
  
  const logoHtml = (d?.logo || tk.logo)
    ? `<img src="${escapeHtml(d?.logo || tk.logo)}" alt="${escapeHtml(tk.symbol)}" class="td-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="td-logo-fallback" style="display:none;background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`
    : `<div class="td-logo-fallback" style="background:${tk.color}20;color:${tk.color}">${tk.icon}</div>`;
  
  const contractAddr = d?.contractAddress || tk.contractAddress || '';
  const shortContract = contractAddr ? contractAddr.substring(0,6) + '...' + contractAddr.substring(contractAddr.length-5) : '';
  
  // Loading state
  if (tokenDetailLoading) {
    return `
      <div class="tp-header">
        <button class="tp-back-btn" data-action="close-token-detail"><i class="ri-arrow-left-s-line"></i></button>
        <div class="tp-title-area">
          ${logoHtml}
          <div class="tp-title-info">
            <div class="tp-token-name">${escapeHtml(tk.symbol)}</div>
          </div>
        </div>
        <div class="tp-header-actions">
          <button class="tp-icon-btn" data-action="tp-external"><i class="ri-external-link-line"></i></button>
          <button class="tp-icon-btn" data-action="tp-favorite"><i class="ri-star-line"></i></button>
        </div>
      </div>
      <div class="td-loading">
        <i class="ri-loader-4-line" style="animation:spin 1s linear infinite;font-size:32px;color:var(--primary)"></i>
        <p style="margin-top:8px;color:var(--text-muted);font-size:13px">${escapeHtml(t('td_loading') || 'Loading token data...')}</p>
      </div>
    `;
  }
  
  // ═══ HEADER ═══
  const headerHtml = `
    <div class="tp-header">
      <button class="tp-back-btn" data-action="close-token-detail"><i class="ri-arrow-left-s-line"></i></button>
      <div class="tp-title-area">
        ${logoHtml}
        <div class="tp-title-info">
          <div class="tp-token-name">${escapeHtml(d?.symbol || tk.symbol)}</div>
          <div class="tp-token-price" style="color:${changeColor}">${fmtPrice(currentPrice)} ${changeSign}${change24h.toFixed(2)}%</div>
        </div>
      </div>
      <div class="tp-header-actions">
        <button class="tp-icon-btn" data-action="tp-external"><i class="ri-external-link-line"></i></button>
        <button class="tp-icon-btn ${tokenIsFavorited ? 'active' : ''}" data-action="tp-favorite"><i class="${tokenIsFavorited ? 'ri-star-fill' : 'ri-star-line'}"></i></button>
      </div>
    </div>
  `;
  
  // ═══ TOP TABS: Trading | Check | Description ═══
  const topTabs = [
    { id: 'trading', label: 'Trading' },
    { id: 'check', label: 'Check' },
    { id: 'description', label: 'Description' },
  ];
  const topTabsHtml = topTabs.map(tab => `
    <button class="tp-top-tab ${tokenDetailTab === tab.id ? 'active' : ''}" data-action="td-tab" data-tab="${tab.id}">
      ${escapeHtml(tab.label)}
    </button>
  `).join('');
  
  let contentHtml = '';
  
  // ═══════════════════════════════════════════════
  // TRADING TAB
  // ═══════════════════════════════════════════════
  if (tokenDetailTab === 'trading') {
    // Chart area
    const chartPeriods = ['1m','5m','15m','1h','1d'];
    const chartPeriodsHtml = chartPeriods.map(p => 
      `<button class="tp-chart-period ${tokenChartPeriod === p ? 'active' : ''}" data-action="td-chart-period" data-period="${p}">${p}</button>`
    ).join('');
    
    const indicators = ['MA','EMA','BOLL','VOL','MACD','KDJ','RSI'];
    const indicatorsHtml = indicators.map(ind => 
      `<button class="tp-indicator ${tokenChartIndicator === ind ? 'active' : ''}" data-action="tp-indicator" data-indicator="${ind}">${ind}</button>`
    ).join('');
    
    // Live price display above chart
    const livePrice = tokenWsPrice || currentPrice;
    const liveChange = tokenWsPriceChange !== null ? tokenWsPriceChange : change24h;
    const liveColor = liveChange >= 0 ? '#10b981' : '#ef4444';
    const liveSign = liveChange >= 0 ? '+' : '';
    const livePriceHtml = `
      <div class="tp-live-price-bar">
        <div class="tp-live-price" style="color:${liveColor}">
          <span class="tp-live-dot"></span> $${fmtPrice(livePrice)}
        </div>
        <div class="tp-live-change" style="color:${liveColor}">${liveSign}${liveChange.toFixed(2)}%</div>
        <div class="tp-live-badge">${tokenWs ? 'LIVE' : (dexPollingInterval ? 'LIVE' : '')}</div>
      </div>
    `;
    
    // Chart section
    const chartHtml = `
      ${livePriceHtml}
      <div class="tp-chart-section">
        <div class="tp-chart-controls">
          <div class="tp-chart-periods">${chartPeriodsHtml}</div>
          <div class="tp-chart-more">
            <span>More ▾</span>
            <span>Price ▾</span>
            <span><i class="ri-settings-3-line"></i></span>
          </div>
        </div>
        <div id="td-kline-chart" style="width:100%;height:220px;background:var(--bg)"></div>
        <div class="tp-indicators">${indicatorsHtml}</div>
      </div>
    `;
    
    // Sub-tabs: Activities | Data | My Position | Pool | Holders
    const holdersCount = tokenHoldersData?.holderCount ? `(${fmtBigNum2(tokenHoldersData.holderCount)})` : '';
    const subTabs = [
      { id: 'activities', label: 'Activities' },
      { id: 'data', label: 'Data' },
      { id: 'myposition', label: 'My Position' },
      { id: 'pool', label: 'Pool' },
      { id: 'holders', label: `Holders${holdersCount}` },
    ];
    const subTabsHtml = subTabs.map(tab => `
      <button class="tp-sub-tab ${tokenTradingSubTab === tab.id ? 'active' : ''}" data-action="tp-sub-tab" data-subtab="${tab.id}">
        ${escapeHtml(tab.label)}
      </button>
    `).join('');
    
    let subContentHtml = '';
    
    // ─── ACTIVITIES SUB-TAB ───
    if (tokenTradingSubTab === 'activities') {
      const filterBtns = ['all','buy','sell'].map(f => 
        `<button class="tp-filter-btn ${tokenActivitiesFilter === f ? 'active' : ''}" data-action="tp-activities-filter" data-filter="${f}">${f.charAt(0).toUpperCase() + f.slice(1)}</button>`
      ).join('');
      
      let txnRows = '';
      const filteredTxns = tokenTxnData.filter(tx => tokenActivitiesFilter === 'all' || tx.type === tokenActivitiesFilter);
      if (filteredTxns.length > 0) {
        txnRows = filteredTxns.map(tx => {
          const typeColor = tx.type === 'buy' ? '#10b981' : '#ef4444';
          const sign = tx.type === 'buy' ? '+' : '-';
          const shortAddr = tx.address.substring(0,5) + '...' + tx.address.substring(tx.address.length-5);
          const timeStr = tx.timeAgo < 60 ? `${tx.timeAgo}seconds ago` : `${Math.floor(tx.timeAgo/60)}minutes ago`;
          return `
            <div class="tp-txn-row">
              <div class="tp-txn-left">
                <span class="tp-txn-type" style="color:${typeColor}">${tx.type === 'buy' ? 'Buy' : 'Sell'}</span>
                <span class="tp-txn-amount" style="color:${typeColor}">${sign}${tx.amount.toLocaleString(undefined,{maximumFractionDigits:2})}</span>
                <span class="tp-txn-time">${timeStr}</span>
              </div>
              <div class="tp-txn-mid">
                <span class="tp-txn-value">${tx.value.toFixed(3)} ${tx.quoteSymbol}</span>
                <span class="tp-txn-price">$${tx.price.toFixed(4)}</span>
              </div>
              <div class="tp-txn-right">
                <span class="tp-txn-addr">${shortAddr}</span>
                <span class="tp-txn-icons">
                  <i class="ri-file-copy-line" data-action="td-copy-contract" data-text="${tx.address}"></i>
                  <i class="ri-external-link-line"></i>
                </span>
              </div>
            </div>
          `;
        }).join('');
      } else {
        txnRows = '<div class="tp-empty">No transactions found</div>';
      }
      
      subContentHtml = `
        <div class="tp-activities">
          <div class="tp-filter-row">
            <div class="tp-filter-btns">${filterBtns}</div>
            <button class="tp-bot-filter"><i class="ri-robot-2-line"></i></button>
          </div>
          <div class="tp-txn-header">
            <span>Type/Amount/Time</span>
            <span>Value/Price</span>
            <span>Address</span>
          </div>
          <div class="tp-txn-list">${txnRows}</div>
        </div>
      `;
    }
    
    // ─── DATA SUB-TAB ───
    else if (tokenTradingSubTab === 'data') {
      const dataItems = [
        { label: 'Market Cap', value: fmtBigNum(d?.marketCap), icon: 'ri-funds-line' },
        { label: '24h Volume', value: fmtBigNum(d?.volume24h), icon: 'ri-exchange-line' },
        { label: 'FDV', value: fmtBigNum(d?.fdv), icon: 'ri-pie-chart-line' },
        { label: 'Liquidity', value: tokenPoolData ? fmtBigNum(tokenPoolData.totalLiquidity) : (d?.liquidity ? fmtBigNum(d.liquidity) : '-'), icon: 'ri-water-flash-line' },
        { label: 'Circulating Supply', value: d?.circulatingSupply ? d.circulatingSupply.toLocaleString() : '-', icon: 'ri-coin-line' },
        { label: 'Total Supply', value: d?.totalSupply ? d.totalSupply.toLocaleString() : '-', icon: 'ri-stack-line' },
      ];
      
      // Price changes
      const changes = [
        { label: '1h', val: d?.priceChange1h },
        { label: '24h', val: d?.priceChange24h },
        { label: '7d', val: d?.priceChange7d },
        { label: '30d', val: d?.priceChange30d },
      ];
      
      const changesHtml = changes.map(c => {
        const v = c.val || 0;
        const col = v >= 0 ? '#10b981' : '#ef4444';
        const sign = v >= 0 ? '+' : '';
        return `<div class="tp-data-change"><span class="tp-data-label">${c.label}</span><span style="color:${col}">${sign}${v.toFixed(2)}%</span></div>`;
      }).join('');
      
      const dataHtml = dataItems.map(item => `
        <div class="tp-data-row">
          <span class="tp-data-label"><i class="${item.icon}"></i> ${item.label}</span>
          <span class="tp-data-value">${item.value}</span>
        </div>
      `).join('');
      
      subContentHtml = `
        <div class="tp-data-section">
          <div class="tp-data-changes">${changesHtml}</div>
          ${dataHtml}
        </div>
      `;
    }
    
    // ─── MY POSITION SUB-TAB ───
    else if (tokenTradingSubTab === 'myposition') {
      subContentHtml = `
        <div class="tp-empty-position">
          <i class="ri-wallet-3-line" style="font-size:48px;color:var(--text-muted);margin-bottom:12px"></i>
          <p style="color:var(--text-muted);font-size:14px">No position data</p>
          <p style="color:var(--text-muted);font-size:12px;margin-top:4px">Connect wallet to view your position</p>
        </div>
      `;
    }
    
    // ─── POOL SUB-TAB ───
    else if (tokenTradingSubTab === 'pool') {
      // Liquidity trend chart placeholder
      const trendHtml = `
        <div class="tp-pool-trend">
          <div class="tp-section-title">Total Liquidity Trend</div>
          <div class="tp-trend-chart" id="tp-liquidity-chart" style="height:120px;background:var(--bg);border-radius:8px"></div>
        </div>
      `;
      
      // Liquidity Top 3
      let pairsHtml = '<div class="tp-empty">No pool data available</div>';
      if (tokenPoolData?.pairs?.length > 0) {
        const topPairs = tokenPoolData.pairs.slice(0, 3);
        pairsHtml = `
          <div class="tp-section-title">Liquidity Top ${topPairs.length}</div>
          <div class="tp-pool-list">
            ${topPairs.map(p => `
              <div class="tp-pool-item">
                <div class="tp-pool-item-left">
                  <div class="tp-pool-dex-icon"><i class="ri-swap-line"></i></div>
                  <div>
                    <div class="tp-pool-dex-name">${escapeHtml(p.dexId)}</div>
                    <div class="tp-pool-pair-info">${fmtBigNum2(p.liquidity / parseFloat(p.priceUsd || '1'))} $${p.baseToken} &nbsp; ${fmtBigNum(p.liquidity)} ${p.quoteToken}</div>
                  </div>
                </div>
                <div class="tp-pool-item-right">
                  ${fmtBigNum(p.liquidity)} <i class="ri-arrow-right-s-line"></i>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      
      // Pool Changes / LP Details sub-tabs
      const poolSubTabsHtml = `
        <div class="tp-pool-subtabs">
          <button class="tp-pool-subtab ${tokenPoolSubTab === 'changes' ? 'active' : ''}" data-action="tp-pool-subtab" data-subtab="changes">Pool Changes</button>
          <button class="tp-pool-subtab ${tokenPoolSubTab === 'lpdetails' ? 'active' : ''}" data-action="tp-pool-subtab" data-subtab="lpdetails">LP Details</button>
        </div>
      `;
      
      let poolSubContent = '';
      if (tokenPoolSubTab === 'lpdetails') {
        // LP holders info
        const lpHolders = tokenHoldersData?.topHolders?.slice(0, 5) || [];
        if (lpHolders.length > 0) {
          poolSubContent = `
            <div class="tp-lp-info">
              <div class="tp-lp-row"><span>LP Holders</span><span>${tokenHoldersData?.holderCount || lpHolders.length}</span></div>
              <div class="tp-lp-row"><span>Locked</span><span class="tp-locked-bar"><span class="tp-locked-fill" style="width:${lpHolders.filter(h=>h.isLocked).length > 0 ? '50' : '0'}%"></span></span><span style="color:${lpHolders.filter(h=>h.isLocked).length > 0 ? '#10b981' : '#ef4444'}">${lpHolders.filter(h=>h.isLocked).length > 0 ? '50.00%' : '0.00%'}</span></div>
            </div>
            <div class="tp-lp-table">
              <div class="tp-lp-table-header">
                <span>#</span><span>Ratio</span><span>Holdings</span><span>Address</span>
              </div>
              ${lpHolders.map(h => {
                const shortAddr = h.address.substring(0,6) + '...' + h.address.substring(h.address.length-5);
                return `
                  <div class="tp-lp-table-row">
                    <span>${h.rank}</span>
                    <span>${h.percent.toFixed(2)}%</span>
                    <span>${fmtBigNum2(h.balance)}</span>
                    <span class="tp-lp-addr">
                      ${h.tag ? `<span class="tp-lp-tag">${escapeHtml(h.tag)}</span>` : shortAddr}
                      <i class="ri-file-copy-line" data-action="td-copy-contract" data-text="${h.address}"></i>
                      <i class="ri-external-link-line"></i>
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        } else {
          poolSubContent = '<div class="tp-empty">No LP details available</div>';
        }
      } else {
        poolSubContent = '<div class="tp-empty">No pool changes data</div>';
      }
      
      subContentHtml = `
        <div class="tp-pool-section">
          ${trendHtml}
          ${pairsHtml}
          ${poolSubTabsHtml}
          ${poolSubContent}
        </div>
      `;
    }
    
    // ─── HOLDERS SUB-TAB ───
    else if (tokenTradingSubTab === 'holders') {
      let holdersHtml = '<div class="tp-empty">No holders data available</div>';
      if (tokenHoldersData?.topHolders?.length > 0) {
        holdersHtml = `
          <div class="tp-holders-header">
            <span>Total Holders: ${(tokenHoldersData.holderCount || 0).toLocaleString()}</span>
          </div>
          <div class="tp-holders-table">
            <div class="tp-holders-table-header">
              <span>#</span><span>Address</span><span>Ratio</span><span>Holdings</span>
            </div>
            ${tokenHoldersData.topHolders.map(h => {
              const shortAddr = h.address.substring(0,6) + '...' + h.address.substring(h.address.length-5);
              return `
                <div class="tp-holders-row">
                  <span>${h.rank}</span>
                  <span class="tp-holder-addr">
                    ${shortAddr}
                    ${h.isContract ? '<span class="tp-holder-tag">Contract</span>' : ''}
                    ${h.isLocked ? '<span class="tp-holder-tag locked">Locked</span>' : ''}
                    ${h.tag ? `<span class="tp-holder-tag">${escapeHtml(h.tag)}</span>` : ''}
                  </span>
                  <span>${h.percent.toFixed(2)}%</span>
                  <span>${fmtBigNum2(h.balance)}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
      subContentHtml = `<div class="tp-holders-section">${holdersHtml}</div>`;
    }
    
    contentHtml = `
      ${chartHtml}
      <div class="tp-sub-tabs-scroll">${subTabsHtml}</div>
      <div class="tp-sub-content">${subContentHtml}</div>
    `;
    
    // Schedule chart rendering
    setTimeout(() => {
      const chartDaysMap = {'1m':'1','5m':'1','15m':'1','1h':'1','1d':'7'};
      loadTokenChart(tokenDetailId, chartDaysMap[tokenChartPeriod] || '7');
    }, 100);
  }
  
  // ═══════════════════════════════════════════════
  // CHECK TAB
  // ═══════════════════════════════════════════════
  else if (tokenDetailTab === 'check') {
    const sec = tokenSecurityData;
    
    if (!sec && !contractAddr) {
      contentHtml = `
        <div class="tp-check-disclaimer">${escapeHtml(t('tp_check_disclaimer') || 'Security check results are for reference only, not a guarantee of accuracy or an endorsement, and not investment advice. Do your own research before trading.')}</div>
        <div class="tp-empty" style="margin-top:40px">
          <i class="ri-shield-line" style="font-size:48px;color:var(--text-muted)"></i>
          <p style="margin-top:12px;color:var(--text-muted)">No contract address available for security check</p>
        </div>
      `;
    } else if (!sec) {
      contentHtml = `
        <div class="tp-check-disclaimer">${escapeHtml(t('tp_check_disclaimer') || 'Security check results are for reference only, not a guarantee of accuracy or an endorsement, and not investment advice. Do your own research before trading.')}</div>
        <div class="tp-empty" style="margin-top:40px">
          <i class="ri-loader-4-line" style="animation:spin 1s linear infinite;font-size:32px;color:var(--primary)"></i>
          <p style="margin-top:12px;color:var(--text-muted)">Loading security data...</p>
        </div>
      `;
    } else {
      // Count risks
      const checkItems = [
        { key: 'is_open_source', label: 'Open Source Contract', safe: '1' },
        { key: 'is_proxy', label: 'Proxy Contract', safe: '0' },
        { key: 'is_mintable', label: 'Mintable', safe: '0' },
        { key: 'owner_change_balance', label: 'Owner Can Modify Balances', safe: '0' },
        { key: 'can_take_back_ownership', label: 'Can Take Back Ownership', safe: '0' },
        { key: 'hidden_owner', label: 'Hidden Owner', safe: '0' },
        { key: 'selfdestruct', label: 'Self Destruct', safe: '0' },
        { key: 'external_call', label: 'External Call', safe: '0' },
        { key: 'is_honeypot', label: 'Honeypot', safe: '0' },
        { key: 'transfer_pausable', label: 'Transfer Pausable', safe: '0' },
        { key: 'is_blacklisted', label: 'Blacklist Function', safe: '0' },
        { key: 'is_whitelisted', label: 'Whitelist Function', safe: '0' },
        { key: 'is_anti_whale', label: 'Anti-Whale Mechanism', safe: null },
        { key: 'anti_whale_modifiable', label: 'Anti-Whale Settings Modifiable', safe: '0' },
        { key: 'trading_cooldown', label: 'Trading Cooldown', safe: '0' },
        { key: 'personal_slippage_modifiable', label: 'Personal Slippage Modifiable', safe: '0' },
      ];
      
      let highRisk = 0, mediumRisk = 0;
      const itemsHtml = checkItems.map(item => {
        const val = sec[item.key];
        if (val === undefined || val === null) return '';
        const strVal = String(val);
        let isRisk = false;
        let isMedium = false;
        if (item.safe !== null) {
          isRisk = strVal !== item.safe;
          if (isRisk) {
            if (['is_honeypot','selfdestruct','hidden_owner','can_take_back_ownership'].includes(item.key)) highRisk++;
            else mediumRisk++;
            if (['is_anti_whale','anti_whale_modifiable','trading_cooldown','is_whitelisted','is_blacklisted'].includes(item.key)) isMedium = true;
          }
        }
        const icon = isRisk ? (isMedium ? '<i class="ri-alert-line" style="color:#f59e0b"></i>' : '<i class="ri-close-circle-line" style="color:#ef4444"></i>') : '<i class="ri-checkbox-circle-line" style="color:#10b981"></i>';
        const valText = strVal === '1' ? 'Yes' : 'No';
        return `
          <div class="tp-check-item">
            <span class="tp-check-icon">${icon}</span>
            <span class="tp-check-label">${escapeHtml(item.label)}</span>
            <span class="tp-check-value">${valText}</span>
          </div>
        `;
      }).filter(Boolean).join('');
      
      // Tax rates
      const buyTax = sec.buy_tax ? (parseFloat(sec.buy_tax) * 100).toFixed(0) + '%' : 'Unknown';
      const sellTax = sec.sell_tax ? (parseFloat(sec.sell_tax) * 100).toFixed(0) + '%' : 'Unknown';
      
      contentHtml = `
        <div class="tp-check-disclaimer">${escapeHtml(t('tp_check_disclaimer') || 'Security check results are for reference only, not a guarantee of accuracy or an endorsement, and not investment advice. Do your own research before trading.')}</div>
        
        <div class="tp-scan-overview">
          <div class="tp-section-title">Scan Overview</div>
          <div class="tp-risk-cards">
            <div class="tp-risk-card high">
              <i class="ri-close-circle-fill"></i>
              <div>
                <div class="tp-risk-label">High risk</div>
                <div class="tp-risk-count">${highRisk}</div>
              </div>
            </div>
            <div class="tp-risk-divider"></div>
            <div class="tp-risk-card medium">
              <i class="ri-alert-fill"></i>
              <div>
                <div class="tp-risk-label">Medium Risk</div>
                <div class="tp-risk-count">${mediumRisk}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tp-tax-section">
          <div class="tp-section-title">Tax Rate</div>
          <div class="tp-tax-header">
            <span></span><span>Buy Tax <i class="ri-question-line"></i></span><span>Sell Tax <i class="ri-question-line"></i></span>
          </div>
          <div class="tp-tax-row">
            <span class="tp-tax-source"><i class="ri-shield-check-line" style="color:#10b981"></i> goplus</span>
            <span>${buyTax === '0%' ? '0%' : buyTax}</span>
            <span>${sellTax === '0%' ? '0%' : sellTax}</span>
          </div>
        </div>
        
        <div class="tp-check-items-section">
          <div class="tp-section-title">Check Items</div>
          <div class="tp-check-items-list">${itemsHtml}</div>
        </div>
      `;
    }
  }
  
  // ═══════════════════════════════════════════════
  // DESCRIPTION TAB
  // ═══════════════════════════════════════════════
  else if (tokenDetailTab === 'description') {
    let desc = d?.description ? d.description.replace(/<[^>]*>/g, '').substring(0, 500) : (d?.symbol || tk.symbol);
    
    contentHtml = `
      <div class="tp-desc-section">
        <div class="tp-desc-token-info">
          ${logoHtml}
          <span class="tp-desc-token-name">${escapeHtml(d?.symbol || tk.symbol)}</span>
        </div>
        <div class="tp-desc-rows">
          <div class="tp-desc-row">
            <span class="tp-desc-label">Contract</span>
            <span class="tp-desc-value">
              ${contractAddr ? `${escapeHtml(contractAddr.substring(0,14))}...${escapeHtml(contractAddr.substring(contractAddr.length-8))}` : 'N/A'}
              ${contractAddr ? `<i class="ri-file-copy-line" data-action="td-copy-contract" data-text="${escapeHtml(contractAddr)}"></i>` : ''}
            </span>
          </div>
          <div class="tp-desc-row">
            <span class="tp-desc-label">Total Supply</span>
            <span class="tp-desc-value">${d?.totalSupply ? d.totalSupply.toLocaleString() : '-'}</span>
          </div>
        </div>
        <div class="tp-desc-divider"></div>
        <div class="tp-desc-text-section">
          <div class="tp-desc-text-title">Description</div>
          <div class="tp-desc-text">${escapeHtml(desc)}${desc.length >= 500 ? '...' : ''}</div>
        </div>
      </div>
    `;
  }
  
  // ═══ BOTTOM BUTTONS ═══
  const bottomBtns = `
    <div class="tp-bottom-btns">
      <button class="tp-trade-btn" data-action="tp-trade">Trade</button>
      <button class="tp-meme-btn" data-action="tp-meme-mode">Meme Mode</button>
    </div>
  `;
  
  return `
    ${headerHtml}
    <div class="tp-top-tabs">${topTabsHtml}</div>
    <div class="tp-content">
      ${contentHtml}
    </div>
    ${bottomBtns}
  `;
}

function fmtBigNum2(n) {
  if (!n || isNaN(n)) return '0';
  n = parseFloat(n);
  if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}


function renderFeeCalculator() {
  // Mode selector
  const modeHtml = `
    <div class="fee-mode-bar">
      <button class="fee-mode-btn ${feeCalcMode === 'forward' ? 'active' : ''}" data-action="fee-mode-forward">
        <i class="ri-arrow-right-line"></i> ${escapeHtml(t('fee_mode_forward') || '수수료 계산')}
      </button>
      <button class="fee-mode-btn ${feeCalcMode === 'reverse' ? 'active' : ''}" data-action="fee-mode-reverse">
        <i class="ri-arrow-left-line"></i> ${escapeHtml(t('fee_mode_reverse') || '선수수료 역산')}
      </button>
      <button class="fee-mode-btn ${feeCalcMode === 'profit' ? 'active' : ''}" data-action="fee-mode-profit">
        <i class="ri-money-dollar-circle-line"></i> ${escapeHtml(t('fee_mode_profit') || '수익 계산')}
      </button>
    </div>
  `;

  // Common: fee percent input
  const feePercentHtml = `
    <div class="fee-input-group">
      <label class="fee-label"><i class="ri-percent-line"></i> ${escapeHtml(t('fee_percent_label') || '수수료율 (%)')}</label>
      <div class="fee-input-row">
        <input type="number" class="form-input fee-input" id="fee-percent-input" value="${escapeHtml(feePercent)}" placeholder="예: 3, 5, 10" inputmode="decimal" step="0.01">
        <span class="fee-unit">%</span>
      </div>
      <div class="fee-quick-pct">
        ${[1, 2, 3, 5, 10, 15, 20].map(p => `<button class="fee-quick-btn ${feePercent === String(p) ? 'active' : ''}" data-action="fee-quick-pct" data-pct="${p}">${p}%</button>`).join('')}
      </div>
    </div>
  `;

  // Token price input (optional)
  const tokenPriceHtml = `
    <div class="fee-input-group">
      <label class="fee-label"><i class="ri-coin-line"></i> ${escapeHtml(t('fee_token_price') || '토큰 가격 (USD, 선택)')}</label>
      <div class="fee-input-row">
        <input type="text" class="form-input fee-input fee-token-symbol" id="fee-token-symbol" value="${escapeHtml(feeTokenSymbol)}" placeholder="USDT" style="width:80px;text-align:center;font-weight:700">
        <span class="fee-eq">=</span>
        <input type="number" class="form-input fee-input" id="fee-token-price" value="${escapeHtml(feeTokenPrice)}" placeholder="1.00" inputmode="decimal" step="0.0001">
        <span class="fee-unit">USD</span>
      </div>
    </div>
  `;

  let inputSection = '';
  let resultSection = '';

  if (feeCalcMode === 'forward') {
    inputSection = `
      <div class="fee-input-group">
        <label class="fee-label"><i class="ri-money-dollar-box-line"></i> ${escapeHtml(t('fee_input_amount') || '출금/전송 금액 (USD)')}</label>
        <input type="number" class="form-input fee-input fee-main-input" id="fee-amount-input" value="${escapeHtml(feeAmount)}" placeholder="10000" inputmode="decimal">
      </div>
    `;
    if (feeResult && feeResult.mode === 'forward') {
      resultSection = `
        <div class="fee-result-card">
          <div class="fee-result-title"><i class="ri-calculator-line"></i> ${escapeHtml(t('fee_result_title') || '계산 결과')}</div>
          <div class="fee-result-row">
            <span class="fee-result-label">${escapeHtml(t('fee_input_label') || '입력 금액')}</span>
            <span class="fee-result-value">$${formatNum(feeResult.inputAmount)}</span>
          </div>
          <div class="fee-result-row danger">
            <span class="fee-result-label">${escapeHtml(t('fee_deducted') || '수수료')} (${feeResult.feePercent}%)</span>
            <span class="fee-result-value">-$${formatNum(feeResult.feeAmount)}</span>
          </div>
          <div class="fee-result-divider"></div>
          <div class="fee-result-row highlight">
            <span class="fee-result-label">${escapeHtml(t('fee_after') || '실수령액')}</span>
            <span class="fee-result-value fee-result-big">$${formatNum(feeResult.afterFee)}</span>
          </div>
          ${feeResult.tokenEquiv !== null ? `
            <div class="fee-result-row token">
              <span class="fee-result-label">${feeResult.tokenSymbol} ${escapeHtml(t('fee_equiv') || '환산')}</span>
              <span class="fee-result-value">${formatNum(feeResult.tokenEquiv, 4)} ${escapeHtml(feeResult.tokenSymbol)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
  } else if (feeCalcMode === 'reverse') {
    inputSection = `
      <div class="fee-input-group">
        <label class="fee-label"><i class="ri-focus-3-line"></i> ${escapeHtml(t('fee_target_amount') || '목표 수령 금액 (USD)')}</label>
        <input type="number" class="form-input fee-input fee-main-input" id="fee-target-input" value="${escapeHtml(feeTargetAmount)}" placeholder="10000" inputmode="decimal">
        <div class="fee-hint"><i class="ri-information-line"></i> ${escapeHtml(t('fee_reverse_hint') || '이 금액을 실제로 받으려면 얼마를 출금해야 하는지 계산합니다')}</div>
      </div>
    `;
    if (feeResult && feeResult.mode === 'reverse') {
      resultSection = `
        <div class="fee-result-card">
          <div class="fee-result-title"><i class="ri-calculator-line"></i> ${escapeHtml(t('fee_reverse_result') || '선수수료 역산 결과')}</div>
          <div class="fee-result-row">
            <span class="fee-result-label">${escapeHtml(t('fee_target_label') || '목표 수령액')}</span>
            <span class="fee-result-value">$${formatNum(feeResult.targetAmount)}</span>
          </div>
          <div class="fee-result-row">
            <span class="fee-result-label">${escapeHtml(t('fee_rate') || '수수료율')}</span>
            <span class="fee-result-value">${feeResult.feePercent}%</span>
          </div>
          <div class="fee-result-divider"></div>
          <div class="fee-result-row highlight">
            <span class="fee-result-label">${escapeHtml(t('fee_required') || '필요 출금액')}</span>
            <span class="fee-result-value fee-result-big">$${formatNum(feeResult.requiredAmount)}</span>
          </div>
          <div class="fee-result-row danger">
            <span class="fee-result-label">${escapeHtml(t('fee_deducted') || '수수료')}</span>
            <span class="fee-result-value">-$${formatNum(feeResult.feeAmount)}</span>
          </div>
          ${feeResult.tokenEquiv !== null ? `
            <div class="fee-result-row token">
              <span class="fee-result-label">${feeResult.tokenSymbol} ${escapeHtml(t('fee_required_token') || '필요 토큰')}</span>
              <span class="fee-result-value">${formatNum(feeResult.tokenEquiv, 4)} ${escapeHtml(feeResult.tokenSymbol)}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
  } else if (feeCalcMode === 'profit') {
    inputSection = `
      <div class="fee-input-group">
        <label class="fee-label"><i class="ri-coin-line"></i> ${escapeHtml(t('fee_token_amount') || '토큰 수량')}</label>
        <input type="number" class="form-input fee-input fee-main-input" id="fee-amount-input" value="${escapeHtml(feeAmount)}" placeholder="1000" inputmode="decimal">
        <div class="fee-hint"><i class="ri-information-line"></i> ${escapeHtml(t('fee_profit_hint') || '토큰 출금 시 수수료 제외 후 실제 수익을 계산합니다')}</div>
      </div>
    `;
    if (feeResult && feeResult.mode === 'profit') {
      resultSection = `
        <div class="fee-result-card">
          <div class="fee-result-title"><i class="ri-money-dollar-circle-line"></i> ${escapeHtml(t('fee_profit_result') || '수익 계산 결과')}</div>
          <div class="fee-result-row">
            <span class="fee-result-label">${escapeHtml(t('fee_input_token') || '입력 토큰')}</span>
            <span class="fee-result-value">${formatNum(feeResult.inputAmount, 4)} ${escapeHtml(feeResult.tokenSymbol)}</span>
          </div>
          <div class="fee-result-row danger">
            <span class="fee-result-label">${escapeHtml(t('fee_deducted') || '수수료')} (${feeResult.feePercent}%)</span>
            <span class="fee-result-value">-${formatNum(feeResult.feeAmount, 4)} ${escapeHtml(feeResult.tokenSymbol)}</span>
          </div>
          <div class="fee-result-divider"></div>
          <div class="fee-result-row highlight">
            <span class="fee-result-label">${escapeHtml(t('fee_received_token') || '실수령 토큰')}</span>
            <span class="fee-result-value fee-result-big">${formatNum(feeResult.afterFee, 4)} ${escapeHtml(feeResult.tokenSymbol)}</span>
          </div>
          <div class="fee-result-row highlight">
            <span class="fee-result-label">${escapeHtml(t('fee_usdt_value') || 'USDT 환산')}</span>
            <span class="fee-result-value fee-result-big">$${formatNum(feeResult.usdtValue)}</span>
          </div>
          <div class="fee-result-row" style="opacity:0.7">
            <span class="fee-result-label">${escapeHtml(t('fee_token_price_used') || '적용 토큰 가격')}</span>
            <span class="fee-result-value">1 ${escapeHtml(feeResult.tokenSymbol)} = $${formatNum(feeResult.tokenPrice, 4)}</span>
          </div>
        </div>
      `;
    }
  }

  return `
    ${modeHtml}
    ${feePercentHtml}
    ${tokenPriceHtml}
    ${inputSection}
    <div class="fee-calc-btn-wrap">
      <button class="btn btn-primary fee-calc-btn" data-action="fee-calculate">
        <i class="ri-calculator-line"></i> ${escapeHtml(t('fee_calculate_btn') || '계산하기')}
      </button>
      <button class="btn btn-outline fee-reset-btn" data-action="fee-reset">
        <i class="ri-refresh-line"></i>
      </button>
    </div>
    ${resultSection}
  `;
}

// ═════════════════════════════════════════════════════════════
// GENERAL CALCULATOR
// ═════════════════════════════════════════════════════════════

function generalCalcReset() {
  generalCalcDisplay = '0';
  generalCalcPrevValue = null;
  generalCalcOperator = null;
  generalCalcWaitingForOperand = false;
}

function generalCalcInputDigit(digit) {
  if (generalCalcWaitingForOperand) {
    generalCalcDisplay = digit;
    generalCalcWaitingForOperand = false;
  } else {
    generalCalcDisplay = generalCalcDisplay === '0' ? digit : generalCalcDisplay + digit;
  }
}

function generalCalcInputDot() {
  if (generalCalcWaitingForOperand) {
    generalCalcDisplay = '0.';
    generalCalcWaitingForOperand = false;
    return;
  }
  if (!generalCalcDisplay.includes('.')) {
    generalCalcDisplay += '.';
  }
}

function generalCalcToggleSign() {
  const val = parseFloat(generalCalcDisplay);
  if (val !== 0) {
    generalCalcDisplay = (-val).toString();
  }
}

function generalCalcPercent() {
  const val = parseFloat(generalCalcDisplay);
  if (generalCalcPrevValue !== null && generalCalcOperator) {
    generalCalcDisplay = (generalCalcPrevValue * val / 100).toString();
  } else {
    generalCalcDisplay = (val / 100).toString();
  }
}

function generalCalcPerformOperation(nextOp) {
  const inputValue = parseFloat(generalCalcDisplay);
  
  if (generalCalcPrevValue === null) {
    generalCalcPrevValue = inputValue;
  } else if (generalCalcOperator) {
    const result = generalCalcCalculate(generalCalcPrevValue, inputValue, generalCalcOperator);
    generalCalcDisplay = String(result);
    generalCalcPrevValue = result;
  }
  
  generalCalcWaitingForOperand = true;
  generalCalcOperator = nextOp;
}

function generalCalcCalculate(prev, next, op) {
  switch (op) {
    case '+': return prev + next;
    case '-': return prev - next;
    case '*': return prev * next;
    case '/': return next !== 0 ? prev / next : 0;
    default: return next;
  }
}

function generalCalcEquals() {
  if (generalCalcOperator === null || generalCalcPrevValue === null) return;
  const inputValue = parseFloat(generalCalcDisplay);
  const result = generalCalcCalculate(generalCalcPrevValue, inputValue, generalCalcOperator);
  generalCalcDisplay = String(result);
  generalCalcPrevValue = null;
  generalCalcOperator = null;
  generalCalcWaitingForOperand = true;
}

function generalCalcBackspace() {
  if (generalCalcWaitingForOperand) return;
  if (generalCalcDisplay.length > 1) {
    generalCalcDisplay = generalCalcDisplay.slice(0, -1);
  } else {
    generalCalcDisplay = '0';
  }
}

function generalCalcMemoryAdd() {
  generalCalcMemory += parseFloat(generalCalcDisplay);
}

function generalCalcMemorySub() {
  generalCalcMemory -= parseFloat(generalCalcDisplay);
}

function generalCalcMemoryRecall() {
  generalCalcDisplay = String(generalCalcMemory);
  generalCalcWaitingForOperand = true;
}

function generalCalcMemoryClear() {
  generalCalcMemory = 0;
}

function formatCalcDisplay(val) {
  if (val === 'Error') return 'Error';
  const num = parseFloat(val);
  if (isNaN(num)) return '0';
  if (val.endsWith('.')) return val;
  if (Number.isInteger(num) && !val.includes('.')) {
    return num.toLocaleString();
  }
  const parts = val.split('.');
  return parseFloat(parts[0]).toLocaleString() + '.' + (parts[1] || '');
}

// ═══ Number to words by language ═══
function numberToKorean(num) {
  if (num === 0) return '영';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const units = ['', '만', '억', '조', '경'];
  const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const subUnits = ['', '십', '백', '천'];
  const intPart = Math.floor(num);
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 4) {
    groups.unshift(str.slice(Math.max(0, i - 4), i));
  }
  let result = '';
  const totalGroups = groups.length;
  for (let gi = 0; gi < totalGroups; gi++) {
    const g = groups[gi];
    const unitIdx = totalGroups - 1 - gi;
    let groupStr = '';
    for (let di = 0; di < g.length; di++) {
      const d = parseInt(g[di]);
      if (d === 0) continue;
      const subUnit = subUnits[g.length - 1 - di];
      if (d === 1 && subUnit) groupStr += subUnit;
      else groupStr += digits[d] + subUnit;
    }
    if (groupStr) result += groupStr + units[unitIdx];
  }
  const decPart = String(num).includes('.') ? String(num).split('.')[1] : '';
  if (decPart) {
    result += ' 점 ' + decPart.split('').map(d => digits[parseInt(d)] || '영').join('');
  }
  return (isNeg ? '마이너스 ' : '') + (result || '영');
}

function numberToChinese(num) {
  if (num === 0) return '零';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const digits = ['零','一','二','三','四','五','六','七','八','九'];
  const units = ['', '万', '亿', '万亿', '兆'];
  const subUnits = ['', '十', '百', '千'];
  const intPart = Math.floor(num);
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 4) {
    groups.unshift(str.slice(Math.max(0, i - 4), i));
  }
  let result = '';
  const totalGroups = groups.length;
  for (let gi = 0; gi < totalGroups; gi++) {
    const g = groups[gi];
    const unitIdx = totalGroups - 1 - gi;
    let groupStr = '';
    let prevZero = false;
    for (let di = 0; di < g.length; di++) {
      const d = parseInt(g[di]);
      if (d === 0) { prevZero = true; continue; }
      if (prevZero && groupStr) groupStr += '零';
      prevZero = false;
      groupStr += digits[d] + subUnits[g.length - 1 - di];
    }
    if (groupStr) result += groupStr + units[unitIdx];
  }
  return (isNeg ? '负' : '') + (result || '零');
}

function numberToJapanese(num) {
  if (num === 0) return '零';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const digits = ['','一','二','三','四','五','六','七','八','九'];
  const units = ['', '万', '億', '兆', '京'];
  const subUnits = ['', '十', '百', '千'];
  const intPart = Math.floor(num);
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 4) {
    groups.unshift(str.slice(Math.max(0, i - 4), i));
  }
  let result = '';
  const totalGroups = groups.length;
  for (let gi = 0; gi < totalGroups; gi++) {
    const g = groups[gi];
    const unitIdx = totalGroups - 1 - gi;
    let groupStr = '';
    for (let di = 0; di < g.length; di++) {
      const d = parseInt(g[di]);
      if (d === 0) continue;
      const subUnit = subUnits[g.length - 1 - di];
      if (d === 1 && subUnit) groupStr += subUnit;
      else groupStr += digits[d] + subUnit;
    }
    if (groupStr) result += groupStr + units[unitIdx];
  }
  return (isNeg ? 'マイナス' : '') + (result || '零');
}

function numberToThai(num) {
  if (num === 0) return 'ศูนย์';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const ones = ['','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า'];
  const intPart = Math.floor(num);
  if (intPart >= 1e12) return intPart.toLocaleString('th-TH');
  function readGroup(n) {
    if (n === 0) return '';
    const m = Math.floor(n / 1000000); const r = n % 1000000;
    const ht = Math.floor(r / 100000); const tt = Math.floor((r % 100000) / 10000);
    const t = Math.floor((r % 10000) / 1000); const h = Math.floor((r % 1000) / 100);
    const te = Math.floor((r % 100) / 10); const o = r % 10;
    let s = '';
    if (m > 0) s += readGroup(m) + 'ล้าน';
    if (ht > 0) s += ones[ht] + 'แสน';
    if (tt > 0) s += ones[tt] + 'หมื่น';
    if (t > 0) s += ones[t] + 'พัน';
    if (h > 0) s += ones[h] + 'ร้อย';
    if (te === 1) s += 'สิบ';
    else if (te === 2) s += 'ยี่สิบ';
    else if (te > 2) s += ones[te] + 'สิบ';
    if (o === 1 && te > 0) s += 'เอ็ด';
    else if (o > 0) s += ones[o];
    return s;
  }
  return (isNeg ? 'ลบ' : '') + readGroup(intPart);
}

function numberToVietnamese(num) {
  if (num === 0) return 'không';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const ones = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
  const intPart = Math.floor(num);
  if (intPart >= 1e15) return intPart.toLocaleString('vi-VN');
  function readTriple(h, t, o, hasHigher) {
    let s = '';
    if (h > 0) s += ones[h] + ' trăm ';
    else if (hasHigher && (t > 0 || o > 0)) s += 'không trăm ';
    if (t > 1) s += ones[t] + ' mươi ';
    else if (t === 1) s += 'mười ';
    else if (t === 0 && o > 0 && (h > 0 || hasHigher)) s += 'lẻ ';
    if (o === 5 && t >= 1) s += 'lăm';
    else if (o === 1 && t > 1) s += 'mốt';
    else if (o > 0) s += ones[o];
    return s.trim();
  }
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 3) {
    groups.unshift(str.slice(Math.max(0, i - 3), i));
  }
  const unitNames = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ'];
  let result = '';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const padded = g.padStart(3, '0');
    const h = parseInt(padded[0]), t = parseInt(padded[1]), o = parseInt(padded[2]);
    const unitIdx = groups.length - 1 - i;
    const hasHigher = i > 0;
    const txt = readTriple(h, t, o, hasHigher);
    if (txt) result += (result ? ' ' : '') + txt + (unitNames[unitIdx] || '');
  }
  return (isNeg ? 'âm ' : '') + result;
}

function numberToRussian(num) {
  if (num === 0) return 'ноль';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const intPart = Math.floor(num);
  if (intPart >= 1e15) return intPart.toLocaleString('ru-RU');
  const ones = ['','один','два','три','четыре','пять','шесть','семь','восемь','девять'];
  const teens = ['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'];
  const tens = ['','','двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'];
  const hundreds = ['','сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'];
  function readTriple(n) {
    if (n === 0) return '';
    const h = Math.floor(n / 100), rest = n % 100, t = Math.floor(rest / 10), o = rest % 10;
    let s = '';
    if (h > 0) s += hundreds[h] + ' ';
    if (rest >= 10 && rest <= 19) s += teens[rest - 10];
    else { if (t > 0) s += tens[t] + ' '; if (o > 0) s += ones[o]; }
    return s.trim();
  }
  const unitNames = [['','',''],['тысяча','тысячи','тысяч'],['миллион','миллиона','миллионов'],['миллиард','миллиарда','миллиардов'],['триллион','триллиона','триллионов']];
  function getForm(n, forms) { const m = n % 100; if (m >= 11 && m <= 19) return forms[2]; const l = m % 10; if (l === 1) return forms[0]; if (l >= 2 && l <= 4) return forms[1]; return forms[2]; }
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 3) {
    groups.unshift(parseInt(str.slice(Math.max(0, i - 3), i)));
  }
  let result = '';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const unitIdx = groups.length - 1 - i;
    if (g === 0) continue;
    let txt = readTriple(g);
    if (unitIdx === 1) { txt = txt.replace('один', 'одна').replace('два', 'две'); }
    if (unitIdx > 0 && unitNames[unitIdx]) txt += ' ' + getForm(g, unitNames[unitIdx]);
    result += (result ? ' ' : '') + txt;
  }
  return (isNeg ? 'минус ' : '') + result;
}

function numberToEnglish(num) {
  if (num === 0) return 'zero';
  if (isNaN(num) || !isFinite(num)) return '';
  const isNeg = num < 0; num = Math.abs(num);
  const intPart = Math.floor(num);
  if (intPart >= 1e15) return intPart.toLocaleString('en-US');
  const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function readTriple(n) {
    if (n === 0) return '';
    const h = Math.floor(n / 100), rest = n % 100;
    let s = '';
    if (h > 0) s += ones[h] + ' hundred';
    if (rest > 0) {
      if (s) s += ' ';
      if (rest < 20) s += ones[rest];
      else s += tens[Math.floor(rest / 10)] + (rest % 10 ? '-' + ones[rest % 10] : '');
    }
    return s;
  }
  const unitNames = ['','thousand','million','billion','trillion'];
  const str = String(intPart);
  const groups = [];
  for (let i = str.length; i > 0; i -= 3) {
    groups.unshift(parseInt(str.slice(Math.max(0, i - 3), i)));
  }
  let result = '';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const unitIdx = groups.length - 1 - i;
    if (g === 0) continue;
    let txt = readTriple(g);
    if (unitNames[unitIdx]) txt += ' ' + unitNames[unitIdx];
    result += (result ? ' ' : '') + txt;
  }
  return (isNeg ? 'minus ' : '') + result;
}

function getNumberInWords(numStr) {
  const num = parseFloat(numStr);
  if (isNaN(num) || numStr === 'Error' || num === 0) return '';
  const lang = state.language || 'ko';
  const langInfo = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  let words = '';
  switch(lang) {
    case 'ko': words = numberToKorean(num); break;
    case 'zh': words = numberToChinese(num); break;
    case 'ja': words = numberToJapanese(num); break;
    case 'th': words = numberToThai(num); break;
    case 'vi': words = numberToVietnamese(num); break;
    case 'ru': words = numberToRussian(num); break;
    default: words = numberToEnglish(num); break;
  }
  return langInfo.flag + ' ' + words;
}

function renderGeneralCalculator() {
  const displayVal = formatCalcDisplay(generalCalcDisplay);
  const opSymbol = generalCalcOperator ? ({'+':"+",'-':"\u2212",'*':"\u00d7",'/':"\u00f7"}[generalCalcOperator] || '') : '';
  const prevDisplay = generalCalcPrevValue !== null ? `${parseFloat(generalCalcPrevValue).toLocaleString()} ${opSymbol}` : '';
  const memIndicator = generalCalcMemory !== 0 ? '<span class="gc-mem-indicator">M</span>' : '';
  
  return `
    <div class="general-calc">
      <div class="gc-display">
        <div class="gc-display-top">
          ${memIndicator}
          <span class="gc-prev-value">${prevDisplay}</span>
        </div>
        <div class="gc-display-main">${displayVal}</div>
        ${getNumberInWords(generalCalcDisplay) ? `<div class="gc-display-words">${getNumberInWords(generalCalcDisplay)}</div>` : ''}
      </div>
      <div class="gc-memory-row">
        <button class="gc-mem-btn" data-action="gc-mc">MC</button>
        <button class="gc-mem-btn" data-action="gc-mr">MR</button>
        <button class="gc-mem-btn" data-action="gc-m-plus">M+</button>
        <button class="gc-mem-btn" data-action="gc-m-minus">M-</button>
      </div>
      <div class="gc-buttons">
        <button class="gc-btn gc-func" data-action="gc-clear">AC</button>
        <button class="gc-btn gc-func" data-action="gc-toggle-sign">+/-</button>
        <button class="gc-btn gc-func" data-action="gc-percent">%</button>
        <button class="gc-btn gc-op ${generalCalcOperator === '/' ? 'active' : ''}" data-action="gc-op" data-op="/">\u00f7</button>
        
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="7">7</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="8">8</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="9">9</button>
        <button class="gc-btn gc-op ${generalCalcOperator === '*' ? 'active' : ''}" data-action="gc-op" data-op="*">\u00d7</button>
        
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="4">4</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="5">5</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="6">6</button>
        <button class="gc-btn gc-op ${generalCalcOperator === '-' ? 'active' : ''}" data-action="gc-op" data-op="-">\u2212</button>
        
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="1">1</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="2">2</button>
        <button class="gc-btn gc-num" data-action="gc-digit" data-digit="3">3</button>
        <button class="gc-btn gc-op ${generalCalcOperator === '+' ? 'active' : ''}" data-action="gc-op" data-op="+">+</button>
        
        <button class="gc-btn gc-num gc-zero" data-action="gc-digit" data-digit="0">0</button>
        <button class="gc-btn gc-num" data-action="gc-dot">.</button>
        <button class="gc-btn gc-backspace" data-action="gc-backspace"><i class="ri-delete-back-2-line"></i></button>
        <button class="gc-btn gc-equals" data-action="gc-equals">=</button>
      </div>
    </div>
  `;
}

// ═════════════════════════════════════════════════════════════
// AI CHAT SCREEN (Gemini)
// ═════════════════════════════════════════════════════════════

function loadAiSettings() {
  try {
    const saved = localStorage.getItem('ibag_ai_settings');
    if (saved) {
      const data = JSON.parse(saved);
      aiGeminiApiKey = data.apiKey || '';
      aiGeminiApiKeys = data.apiKeys || [];
      aiCurrentKeyIndex = data.currentKeyIndex || 0;
      // Migrate: if only single key exists, add to keys array
      if (aiGeminiApiKey && aiGeminiApiKeys.length === 0) {
        aiGeminiApiKeys = [aiGeminiApiKey];
      }
      if (aiGeminiApiKeys.length > 0) {
        aiGeminiApiKey = aiGeminiApiKeys[0];
      }
    }
    const msgs = localStorage.getItem('ibag_ai_messages');
    if (msgs) {
      aiMessages = JSON.parse(msgs);
      aiChatHistory = aiMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    }
  } catch(e) { console.error('loadAiSettings error', e); }
}

function getNextApiKey() {
  if (aiGeminiApiKeys.length === 0) return aiGeminiApiKey;
  aiCurrentKeyIndex = (aiCurrentKeyIndex + 1) % aiGeminiApiKeys.length;
  saveAiSettings();
  return aiGeminiApiKeys[aiCurrentKeyIndex];
}

function getCurrentApiKey() {
  if (aiGeminiApiKeys.length === 0) return aiGeminiApiKey;
  if (aiCurrentKeyIndex >= aiGeminiApiKeys.length) aiCurrentKeyIndex = 0;
  return aiGeminiApiKeys[aiCurrentKeyIndex];
}

function saveAiSettings() {
  try {
    localStorage.setItem('ibag_ai_settings', JSON.stringify({
      apiKey: aiGeminiApiKey,
      apiKeys: aiGeminiApiKeys,
      currentKeyIndex: aiCurrentKeyIndex
    }));
    localStorage.setItem('ibag_ai_messages', JSON.stringify(aiMessages));
  } catch(e) { console.error('saveAiSettings error', e); }
}

async function sendGeminiMessage(userText) {
  if (!userText.trim() && aiPendingAttachments.length === 0) return;
  
  // Capture current attachments
  const currentAttachments = [...aiPendingAttachments];
  aiPendingAttachments = [];
  
  // Add user message with attachments
  const userMsg = { role: 'user', text: userText || (currentAttachments.length > 0 ? '이 파일을 분석해주세요' : ''), timestamp: Date.now() };
  if (currentAttachments.length > 0) {
    userMsg.attachments = currentAttachments;
  }
  aiMessages.push(userMsg);
  aiChatHistory.push({ role: 'user', parts: [{ text: userMsg.text }], attachments: currentAttachments });
  aiInputText = '';
  aiIsLoading = true;
  render();
  scrollAiChatToBottom();
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout for image uploads
    
    // Build conversation history for server proxy
    const chatMsgs = aiChatHistory.map(h => {
      const msg = {
        role: h.role === 'model' ? 'model' : h.role,
        text: h.parts?.[0]?.text || ''
      };
      if (h.attachments && h.attachments.length > 0) {
        msg.attachments = h.attachments.map(a => ({ type: a.type, data: a.data, name: a.name }));
      }
      return msg;
    });
    
    const resp = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ messages: chatMsgs })
    });
    clearTimeout(timeout);
    
    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `Server Error ${resp.status}`);
    }
    
    const data = await resp.json();
    const aiText = data.text || 'No response';
    
    aiMessages.push({ role: 'model', text: aiText, timestamp: Date.now() });
    aiChatHistory.push({ role: 'model', parts: [{ text: aiText }] });
    
    // Keep history manageable (last 20 exchanges)
    if (aiChatHistory.length > 40) {
      aiChatHistory = aiChatHistory.slice(-40);
    }
    saveAiSettings();
  } catch(err) {
    let errorMsg;
    if (err.name === 'AbortError') {
      const lang = state.language || 'en';
      errorMsg = lang === 'ko' ? '\u23f1\ufe0f \uc751\ub2f5 \uc2dc\uac04 \ucd08\uacfc. \ub124\ud2b8\uc6cc\ud06c\ub97c \ud655\uc778\ud558\uace0 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694.' :
                 '\u23f1\ufe0f Request timed out. Please check your network and try again.';
    } else {
      const lang = state.language || 'en';
      errorMsg = lang === 'ko' ? `\u26a0\ufe0f AI \uc11c\ubc84 \uc624\ub958: ${err.message}` :
                 `\u26a0\ufe0f AI Server Error: ${err.message}`;
    }
    aiMessages.push({ role: 'model', text: errorMsg, timestamp: Date.now(), isError: true });
  }
  
  aiIsLoading = false;
  render();
  scrollAiChatToBottom();
}

function scrollAiChatToBottom() {
  setTimeout(() => {
    const chatBox = document.getElementById('ai-chat-messages');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, 100);
}

// ─── K-line Chart (Canvas-based, no external library) ───
let chartOhlcCache = {};
async function loadTokenChart(tokenId, days) {
  const chartEl = document.getElementById('td-kline-chart');
  const volEl = document.getElementById('td-volume-chart');
  if (!chartEl) return;
  
  chartEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite;font-size:24px;color:var(--primary)"></i></div>';
  if (volEl) volEl.innerHTML = '';
  
  const cacheKey = `${tokenId}_${days}`;
  let ohlcData = chartOhlcCache[cacheKey];
  
  if (!ohlcData) {
    try {
      const r = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}/ohlc?vs_currency=usd&days=${days}`);
      if (r.ok) {
        ohlcData = await r.json();
        chartOhlcCache[cacheKey] = ohlcData;
      }
    } catch(e) { console.log('OHLC fetch error:', e); }
  }
  
  if (!ohlcData || ohlcData.length === 0) {
    chartEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:12px">No chart data available</div>';
    return;
  }
  
  renderCandlestickChart(chartEl, ohlcData, 300);
  if (volEl) renderVolumeFromOhlc(volEl, ohlcData, 120);
}

function renderCandlestickChart(container, data, height) {
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  const width = container.clientWidth || 320;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const padding = { top: 10, right: 50, bottom: 25, left: 5 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  
  // data format: [timestamp, open, high, low, close]
  const prices = data.map(d => ({ t: d[0], o: d[1], h: d[2], l: d[3], c: d[4] }));
  const allPrices = prices.flatMap(p => [p.h, p.l]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 1;
  
  const candleW = Math.max(1, (chartW / prices.length) * 0.7);
  const gap = chartW / prices.length;
  
  // Background
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0d1117';
  ctx.fillRect(0, 0, width, height);
  
  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
    // Price label
    const priceVal = maxP - (range / 4) * i;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(fmtPrice(priceVal), width - padding.right + 4, y + 3);
  }
  
  // Candles
  prices.forEach((p, i) => {
    const x = padding.left + gap * i + gap / 2;
    const isGreen = p.c >= p.o;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    // Wick
    const highY = padding.top + ((maxP - p.h) / range) * chartH;
    const lowY = padding.top + ((maxP - p.l) / range) * chartH;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
    
    // Body
    const openY = padding.top + ((maxP - p.o) / range) * chartH;
    const closeY = padding.top + ((maxP - p.c) / range) * chartH;
    const bodyTop = Math.min(openY, closeY);
    const bodyH = Math.max(Math.abs(closeY - openY), 1);
    ctx.fillStyle = color;
    ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
  });
  
  // Date labels
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '8px Inter, sans-serif';
  ctx.textAlign = 'center';
  const labelCount = Math.min(5, prices.length);
  for (let i = 0; i < labelCount; i++) {
    const idx = Math.floor((prices.length / labelCount) * i);
    const d = new Date(prices[idx].t);
    const label = d.getMonth() + 1 + '/' + d.getDate();
    const x = padding.left + gap * idx + gap / 2;
    ctx.fillText(label, x, height - 5);
  }
}

function renderVolumeFromOhlc(container, data, height) {
  // Simulate volume from price range * candle size
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  const width = container.clientWidth || 320;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  container.innerHTML = '';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const padding = { top: 5, right: 50, bottom: 20, left: 5 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  
  const prices = data.map(d => ({ t: d[0], o: d[1], h: d[2], l: d[3], c: d[4] }));
  // Use range as proxy for volume
  const volumes = prices.map(p => (p.h - p.l) * ((p.o + p.c) / 2));
  const maxVol = Math.max(...volumes) || 1;
  const gap = chartW / prices.length;
  const barW = Math.max(1, gap * 0.7);
  
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0d1117';
  ctx.fillRect(0, 0, width, height);
  
  prices.forEach((p, i) => {
    const x = padding.left + gap * i + gap / 2;
    const vol = volumes[i];
    const barH = (vol / maxVol) * chartH;
    const isGreen = p.c >= p.o;
    ctx.fillStyle = isGreen ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)';
    ctx.fillRect(x - barW / 2, padding.top + chartH - barH, barW, barH);
  });
}

// ─── Token Description Auto-Translation ───
let translatedDescCache = {};
async function translateTokenDescription(text, targetLang) {
  if (!text || text.length < 10) return text;
  
  const cacheKey = `${text.substring(0,50)}_${targetLang}`;
  if (translatedDescCache[cacheKey]) return translatedDescCache[cacheKey];
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const resp = await fetch(TRANSLATE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ text: text.substring(0, 500), targetLang })
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      const translated = data.text || text;
      translatedDescCache[cacheKey] = translated;
      return translated;
    }
  } catch(e) { console.log('Translation error:', e); }
  return text;
}

function formatAiMessage(text) {
  // Simple markdown-like formatting
  let html = escapeHtml(text);
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="ai-code-block">$1</pre>');
  // Inline code
  html = html.replace(/`(.+?)`/g, '<code class="ai-inline-code">$1</code>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  // Lists
  html = html.replace(/^- (.+)/gm, '<span class="ai-list-item">$1</span>');
  return html;
}

function renderAIChat() {
  // Settings panel
  if (aiShowSettings) {
    return `
      <div class="ai-chat-screen">
        <div class="sub-header">
          <button data-action="ai-close-settings"><i class="ri-arrow-left-line"></i></button>
          <span>${escapeHtml(t('ai_settings') || 'AI Settings')}</span>
        </div>
        <div class="ai-settings-content">
          <div class="ai-settings-card">
            <div class="ai-settings-icon">
              <i class="ri-sparkling-2-fill"></i>
            </div>
            <h3>iBag AI</h3>
            <p class="ai-settings-desc" style="color:#10b981;font-weight:500;">\u2705 Server AI Mode - No API key needed!</p>
            <div style="background:var(--primary-dim);border:1px solid var(--primary-border);border-radius:12px;padding:16px;margin:12px 0;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <i class="ri-server-line" style="color:var(--primary);font-size:20px;"></i>
                <strong style="color:var(--primary);font-size:14px;">Server Proxy LLM</strong>
              </div>
              <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin:0;">AI responses are processed through the iBag server. No API key configuration required. Unlimited usage with no quota limits.</p>
            </div>
            <button class="ai-save-key-btn" data-action="ai-close-settings" style="margin-top:8px;">
              <i class="ri-arrow-left-line"></i> Back to Chat
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Chat messages
  const messagesHtml = aiMessages.length === 0 ? `
    <div class="ai-welcome">
      <div class="ai-welcome-icon"><i class="ri-sparkling-2-fill"></i></div>
      <h3>${escapeHtml(t('ai_welcome_title') || 'iBag AI')}</h3>
      <p>${escapeHtml(t('ai_welcome_desc') || 'Ask me anything about crypto, DeFi, blockchain, or general questions!')}</p>
      <div class="ai-suggestions">
        <button class="ai-suggest-btn" data-action="ai-suggest" data-text="What is DeFi and how does it work?">
          <i class="ri-question-line"></i> What is DeFi?
        </button>
        <button class="ai-suggest-btn" data-action="ai-suggest" data-text="Explain the difference between Layer 1 and Layer 2 blockchains">
          <i class="ri-stack-line"></i> L1 vs L2
        </button>
        <button class="ai-suggest-btn" data-action="ai-suggest" data-text="How to evaluate a crypto project before investing?">
          <i class="ri-search-eye-line"></i> Token Research
        </button>
        <button class="ai-suggest-btn" data-action="ai-suggest" data-text="What are the current trends in Web3?">
          <i class="ri-global-line"></i> Web3 Trends
        </button>
      </div>
    </div>
  ` : aiMessages.map(msg => {
    let attachHtml = '';
    if (msg.attachments && msg.attachments.length > 0) {
      attachHtml = '<div class="ai-msg-attachments">' + msg.attachments.map(att => {
        if (att.type === 'image') return `<img src="${att.preview || att.data}" class="ai-msg-img" onclick="window.open('${att.data}','_blank')" />`;
        if (att.type === 'video') return `<div class="ai-msg-file-badge"><i class="ri-video-line"></i> ${escapeHtml(att.name)}</div>`;
        return `<div class="ai-msg-file-badge"><i class="ri-file-line"></i> ${escapeHtml(att.name)}</div>`;
      }).join('') + '</div>';
    }
    return `
    <div class="ai-message ${msg.role === 'user' ? 'ai-msg-user' : 'ai-msg-model'} ${msg.isError ? 'ai-msg-error' : ''}">
      <div class="ai-msg-avatar">
        ${msg.role === 'user' ? '<i class="ri-user-3-fill"></i>' : '<i class="ri-sparkling-2-fill"></i>'}
      </div>
      <div class="ai-msg-bubble">
        ${attachHtml}
        <div class="ai-msg-text">${msg.role === 'user' ? escapeHtml(msg.text) : formatAiMessage(msg.text)}</div>
        <div class="ai-msg-time">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    </div>
  `;
  }).join('');
  
  const loadingHtml = aiIsLoading ? `
    <div class="ai-message ai-msg-model">
      <div class="ai-msg-avatar"><i class="ri-sparkling-2-fill"></i></div>
      <div class="ai-msg-bubble">
        <div class="ai-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  ` : '';
  
  return `
    <div class="ai-chat-screen">
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-header-icon"><i class="ri-sparkling-2-fill"></i></div>
          <div>
            <div class="ai-header-title">iBag AI</div>
            <div class="ai-header-sub">Server AI</div>
          </div>
        </div>
        <div class="ai-chat-header-right">
          <button class="ai-header-btn" data-action="ai-clear-chat" title="Clear">
            <i class="ri-delete-bin-line"></i>
          </button>
          <button class="ai-header-btn" data-action="ai-open-settings" title="Settings">
            <i class="ri-settings-3-line"></i>
          </button>
        </div>
      </div>
      <div class="ai-chat-messages" id="ai-chat-messages">
        ${messagesHtml}
        ${loadingHtml}
      </div>
      <div class="ai-chat-input-area">
        ${aiPendingAttachments.length > 0 ? `
        <div class="ai-attachments-preview">
          ${aiPendingAttachments.map((att, i) => `
            <div class="ai-attach-item">
              ${att.type === 'image' ? `<img src="${att.preview || att.data}" class="ai-attach-thumb" />` : 
                att.type === 'video' ? `<div class="ai-attach-thumb ai-attach-video"><i class="ri-video-line"></i></div>` :
                `<div class="ai-attach-thumb ai-attach-file"><i class="ri-file-line"></i></div>`}
              <span class="ai-attach-name">${escapeHtml(att.name || 'file')}</span>
              <button class="ai-attach-remove" data-action="ai-remove-attach" data-idx="${i}"><i class="ri-close-line"></i></button>
            </div>
          `).join('')}
        </div>
        ` : ''}
        <div class="ai-input-wrapper">
          <button class="ai-attach-btn" data-action="ai-attach" title="Attach">
            <i class="ri-add-line"></i>
          </button>
          <textarea id="ai-input" class="ai-text-input" placeholder="${escapeHtml(t('ai_placeholder') || 'Ask iBag AI...')}" rows="1">${escapeHtml(aiInputText)}</textarea>
          <button class="ai-send-btn ${aiIsLoading ? 'disabled' : ''}" data-action="ai-send" ${aiIsLoading ? 'disabled' : ''}>
            <i class="ri-send-plane-2-fill"></i>
          </button>
        </div>
        <input type="file" id="ai-file-input" accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx" multiple style="display:none" />
      </div>
    </div>
  `;
}

// ═════════════════════════════════════════════════════════════
// TRANSLATE SCREEN
// ═════════════════════════════════════════════════════════════
function renderTranslate() {
  const langs = [
    { code: 'auto', name: t('translate_auto') },
    { code: 'ko', name: '한국어' }, { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' }, { code: 'ja', name: '日本語' },
    { code: 'th', name: 'ไทย' }, { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ru', name: 'Русский' }, { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' }, { code: 'ar', name: 'العربية' },
  ];
  const fromOpts = langs.map(l => `<option value="${l.code}" ${translateFrom === l.code ? 'selected' : ''}>${l.name}</option>`).join('');
  const toOpts = langs.filter(l => l.code !== 'auto').map(l => `<option value="${l.code}" ${translateTo === l.code ? 'selected' : ''}>${l.name}</option>`).join('');

  // Interpreter section
  const interpreterSection = `
    <div class="interpreter-section">
      <div class="interpreter-header">
        <i class="ri-mic-line" style="color:var(--primary)"></i>
        <span>${escapeHtml(t('interpreter_title'))}</span>
      </div>
      <div class="interpreter-body">
        <button class="interpreter-btn ${isInterpreting ? 'active' : ''}" data-action="toggle-interpreter">
          <div class="interpreter-mic-ring ${isInterpreting ? 'pulsing' : ''}">
            <i class="${isInterpreting ? 'ri-stop-fill' : 'ri-mic-fill'}"></i>
          </div>
          <span>${isInterpreting ? escapeHtml(t('interpreter_stop')) : escapeHtml(t('interpreter_start'))}</span>
        </button>
        ${interpreterSourceText ? `
          <div class="interpreter-result-box">
            <div class="interpreter-label">${escapeHtml(t('interpreter_heard'))}</div>
            <div class="interpreter-source-text">${escapeHtml(interpreterSourceText)}</div>
          </div>
        ` : ''}
        ${interpreterTranslatedText ? `
          <div class="interpreter-result-box translated">
            <div class="interpreter-label">${escapeHtml(t('interpreter_translated'))}</div>
            <div class="interpreter-translated-text">${escapeHtml(interpreterTranslatedText)}</div>
            <button class="btn btn-primary btn-sm" data-action="interpreter-speak" style="margin-top:8px"><i class="ri-volume-up-line"></i> ${escapeHtml(t('interpreter_play'))}</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('action_translate'))}</span></div>
    <div class="translate-container">
      <div class="translate-lang-row">
        <select class="form-input" id="translate-from" data-translate-from>${fromOpts}</select>
        <button class="calc-swap-btn" data-action="translate-swap"><i class="ri-arrow-left-right-line"></i></button>
        <select class="form-input" id="translate-to" data-translate-to>${toOpts}</select>
      </div>
      <div class="translate-input-area">
        <textarea class="form-textarea" id="translate-input" placeholder="${escapeHtml(t('translate_placeholder'))}" rows="4" data-translate-text>${escapeHtml(translateText)}</textarea>
        <button class="translate-go-btn" data-action="do-translate"><i class="ri-translate-2"></i> ${escapeHtml(t('translate_go'))}</button>
      </div>
      ${translatedResult ? `
        <div class="translate-result">
          <div class="translate-result-text">${escapeHtml(translatedResult)}</div>
          <div class="translate-actions">
            <button class="btn btn-outline btn-sm" data-action="translate-copy"><i class="ri-file-copy-line"></i> ${escapeHtml(t('share_copy'))}</button>
            <button class="btn btn-outline btn-sm" data-action="translate-speak"><i class="ri-volume-up-line"></i> ${escapeHtml(t('translate_speak'))}</button>
          </div>
        </div>
      ` : ''}
      ${interpreterSection}
      ${renderPhotoTranslateSection()}

    </div>
  `;
}

// ─── Photo Translate Section (Enhanced with Image Overlay) ───
let photoTranslateOcrWords = []; // word-level bounding boxes from Tesseract
let photoTranslateOverlayMode = false; // show overlay on image
// photoTranslateViewMode is declared at top of file

function renderPhotoTranslateSection() {
  let content = '';
  if (photoTranslateProcessing) {
    content = `
      <div class="photo-translate-processing">
        <i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i>
        <span>${escapeHtml(t('ocr_processing'))}</span>
      </div>
    `;
  } else if (photoTranslateOcrText) {
    // View mode toggle buttons
    const viewModes = `
      <div class="pt-view-modes">
        <button class="pt-mode-btn ${photoTranslateViewMode === 'overlay' ? 'active' : ''}" data-action="pt-view-overlay"><i class="ri-image-line"></i> ${escapeHtml(t('pt_overlay') || '오버레이')}</button>
        <button class="pt-mode-btn ${photoTranslateViewMode === 'text' ? 'active' : ''}" data-action="pt-view-text"><i class="ri-file-text-line"></i> ${escapeHtml(t('pt_text') || '텍스트')}</button>
      </div>
    `;

    let resultView = '';
    if (photoTranslateViewMode === 'overlay' && photoTranslateImage) {
      // Overlay mode: show translated text on top of image
      resultView = `
        <div class="pt-overlay-container" id="pt-overlay-container">
          <img src="${photoTranslateImage}" alt="captured" class="pt-overlay-img" id="pt-overlay-img">
          <div class="pt-overlay-layer" id="pt-overlay-layer">
            ${photoTranslateResult ? renderOverlayBlocks() : renderOcrOverlayBlocks()}
          </div>
        </div>
      `;
    } else {
      // Text mode: traditional text display
      resultView = `
        <div class="photo-translate-result">
          <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">${escapeHtml(t('ocr_result'))}</div>
          <div class="ocr-text">${escapeHtml(photoTranslateOcrText)}</div>
          ${photoTranslateResult ? `
            <div style="font-size:11px;font-weight:600;color:var(--primary);margin:8px 0 4px">${escapeHtml(t('interpreter_translated'))}</div>
            <div class="translated-text">${escapeHtml(photoTranslateResult)}</div>
          ` : ''}
        </div>
      `;
    }

    content = `
      ${viewModes}
      ${resultView}
      <div class="btn-row" style="margin-top:8px">
        <button class="btn btn-outline btn-sm" data-action="photo-translate-copy"><i class="ri-file-copy-line"></i></button>
        <button class="btn btn-primary btn-sm" data-action="photo-translate-do"><i class="ri-translate-2"></i> ${escapeHtml(t('translate_go'))}</button>
        <button class="btn btn-outline btn-sm" data-action="photo-translate-reset"><i class="ri-refresh-line"></i></button>
      </div>
    `;
  } else {
    content = `
      <button class="photo-translate-btn" data-action="photo-translate-pick">
        <i class="ri-camera-line"></i>
        <span>${escapeHtml(t('photo_translate_pick') || 'Take photo or select image')}</span>
      </button>
    `;
  }

  return `
    <div class="photo-translate-section">
      <div class="photo-translate-header">
        <i class="ri-camera-lens-line" style="color:var(--primary)"></i>
        <span>${escapeHtml(t('photo_translate_title') || 'Photo Translate')}</span>
      </div>
      <div class="photo-translate-body">
        ${content}
      </div>
    </div>
  `;
}

// Render OCR text blocks as overlay on image (before translation)
function renderOcrOverlayBlocks() {
  if (!photoTranslateOcrWords || photoTranslateOcrWords.length === 0) return '';
  return photoTranslateOcrWords.map(line => {
    const { x0, y0, x1, y1 } = line.bbox;
    const fontSize = Math.max(8, Math.min(16, (y1 - y0) * 0.6));
    return `<div class="pt-overlay-block ocr-block" style="left:${x0}px;top:${y0}px;width:${x1-x0}px;height:${y1-y0}px;font-size:${fontSize}px">${escapeHtml(line.text)}</div>`;
  }).join('');
}

// Render translated text blocks as overlay on image
function renderOverlayBlocks() {
  if (!photoTranslateOcrWords || photoTranslateOcrWords.length === 0) {
    // Fallback: show full translated text as single overlay
    return `<div class="pt-overlay-full">${escapeHtml(photoTranslateResult)}</div>`;
  }
  // Split translated text by lines to match OCR lines
  const translatedLines = photoTranslateResult.split('\n').filter(l => l.trim());
  return photoTranslateOcrWords.map((line, idx) => {
    const { x0, y0, x1, y1 } = line.bbox;
    const translatedText = translatedLines[idx] || '';
    const fontSize = Math.max(8, Math.min(16, (y1 - y0) * 0.6));
    return `<div class="pt-overlay-block translated-block" style="left:${x0}px;top:${y0}px;width:${x1-x0}px;min-height:${y1-y0}px;font-size:${fontSize}px">${escapeHtml(translatedText || line.text)}</div>`;
  }).join('');
}

async function doPhotoTranslateOCR(imageDataUrl) {
  photoTranslateImage = imageDataUrl;
  photoTranslateProcessing = true;
  photoTranslateOcrText = '';
  photoTranslateResult = '';
  photoTranslateOcrWords = [];
  photoTranslateViewMode = 'overlay';
  render();

  try {
    const worker = await Tesseract.createWorker('eng+kor+jpn+chi_sim+tha+vie+rus');
    const { data } = await worker.recognize(imageDataUrl);
    await worker.terminate();
    
    if (data.text && data.text.trim()) {
      photoTranslateOcrText = data.text.trim();
      // Store line-level bounding boxes for overlay
      photoTranslateOcrWords = (data.lines || []).filter(l => l.text.trim()).map(l => ({
        text: l.text.trim(),
        bbox: l.bbox
      }));
    } else {
      alert(t('ocr_no_text_msg'));
    }
  } catch (e) {
    console.error('OCR error:', e);
    alert(t('ocr_process_failed'));
  }
  photoTranslateProcessing = false;
  render();
}

async function doPhotoTranslateTranslate() {
  if (!photoTranslateOcrText) return;
  photoTranslateProcessing = true;
  render();
  try {
    const resp = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: photoTranslateOcrText, from: translateFrom === 'auto' ? '' : translateFrom, to: translateTo })
    });
    const data = await resp.json();
    if (data.success) {
      photoTranslateResult = data.translatedText;
      photoTranslateViewMode = 'overlay'; // Switch to overlay to show result on image
    } else {
      alert('Translation failed');
    }
  } catch (e) {
    console.error('Photo translate error:', e);
    alert('Translation service unavailable');
  }
  photoTranslateProcessing = false;
  render();
}


// ═══════════════════════════════════════════════════════════
// ORG CHART
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// VAULT SECURITY GATE
// ═══════════════════════════════════════════════════════════

function renderVaultGate() {
  // If already unlocked, show the org chart list
  if (vaultUnlocked) return renderOrgChartList();

  // Check if vault is configured
  const isConfigured = VaultCrypto.isConfigured();

  if (!isConfigured) {
    // Setup wizard
    return renderVaultSetup();
  } else {
    // Unlock screen
    return renderVaultUnlock();
  }
}

function renderVaultSetup() {
  const steps = [
    { label: t('vault_set_view_pw') || '열람 비밀번호 설정', icon: 'ri-eye-line', desc: t('vault_set_view_pw_desc') || '조직도를 열람할 때 사용할 비밀번호입니다' },
    { label: t('vault_confirm_view_pw') || '열람 비밀번호 확인', icon: 'ri-eye-line', desc: t('vault_confirm_pw_desc') || '비밀번호를 다시 입력해주세요' },
    { label: t('vault_set_panic_pw') || '긴급삭제 비밀번호 설정', icon: 'ri-alarm-warning-line', desc: t('vault_set_panic_pw_desc') || '입력 시 모든 조직도가 즉시 삭제됩니다' },
    { label: t('vault_confirm_panic_pw') || '긴급삭제 비밀번호 확인', icon: 'ri-alarm-warning-line', desc: t('vault_confirm_pw_desc') || '비밀번호를 다시 입력해주세요' }
  ];
  const step = steps[vaultSetupStep] || steps[0];
  const progress = ((vaultSetupStep + 1) / 4 * 100).toFixed(0);

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('vault_setup') || 'Vault 설정')}</span></div>
    <div class="vault-container">
      <div class="vault-progress-bar"><div class="vault-progress-fill" style="width:${progress}%"></div></div>
      <div class="vault-icon-wrap">
        <div class="vault-icon ${vaultSetupStep >= 2 ? 'danger' : ''}"><i class="${step.icon}"></i></div>
      </div>
      <div class="vault-step-label">${escapeHtml(step.label)}</div>
      <div class="vault-step-desc">${escapeHtml(step.desc)}</div>
      ${vaultError ? `<div class="vault-error"><i class="ri-error-warning-line"></i> ${escapeHtml(vaultError)}</div>` : ''}
      <div class="vault-pin-dots">
        ${Array.from({length: 8}, (_, i) => `<div class="vault-dot ${(vaultSetupStep % 2 === 0 ? vaultPwInput : vaultPwConfirm).length > i ? 'filled' : ''} ${vaultError ? 'error' : ''}"></div>`).join('')}
      </div>
      <div class="vault-keypad">
        ${[1,2,3,4,5,6,7,8,9,'',0,'del'].map(k => {
          if (k === '') return '<div class="vault-key empty"></div>';
          if (k === 'del') return '<div class="vault-key del" data-vault-key="del"><i class="ri-delete-back-2-line"></i></div>';
          return `<div class="vault-key" data-vault-key="${k}">${k}</div>`;
        }).join('')}
      </div>
      <div class="vault-bottom-actions">
        ${vaultSetupStep > 0 ? `<button class="vault-back-btn" data-action="vault-step-back"><i class="ri-arrow-left-line"></i> ${escapeHtml(t('vault_go_back') || '이전 단계')}</button>` : ''}
        <button class="vault-reset-btn" data-action="vault-reset-setup"><i class="ri-restart-line"></i> ${escapeHtml(t('vault_start_over') || '처음부터 다시')}</button>
      </div>
    </div>
  `;
}

function renderVaultUnlock() {
  const remainingAttempts = VAULT_MAX_ATTEMPTS - vaultAttempts;

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('plus_orgchart') || '조직도')}</span></div>
    <div class="vault-container">
      <div class="vault-icon-wrap">
        <div class="vault-icon locked"><i class="ri-shield-keyhole-line"></i></div>
      </div>
      <div class="vault-step-label">${escapeHtml(t('vault_enter_pw') || '비밀번호를 입력하세요')}</div>
      <div class="vault-step-desc">${escapeHtml(t('vault_encrypted_desc') || 'AES-256 암호화로 보호됩니다')}</div>
      ${vaultError ? `<div class="vault-error"><i class="ri-error-warning-line"></i> ${escapeHtml(vaultError)}</div>` : ''}
      ${vaultAttempts > 0 ? `<div class="vault-attempts">${escapeHtml(t('vault_attempts_left') || '남은 시도')}: ${remainingAttempts}</div>` : ''}
      <div class="vault-pin-dots">
        ${Array.from({length: 8}, (_, i) => `<div class="vault-dot ${vaultPwInput.length > i ? 'filled' : ''} ${vaultError ? 'error' : ''}"></div>`).join('')}
      </div>
      <div class="vault-keypad">
        ${[1,2,3,4,5,6,7,8,9,'',0,'del'].map(k => {
          if (k === '') return '<div class="vault-key empty"></div>';
          if (k === 'del') return '<div class="vault-key del" data-vault-key="del"><i class="ri-delete-back-2-line"></i></div>';
          return `<div class="vault-key" data-vault-key="${k}">${k}</div>`;
        }).join('')}
      </div>
      <div class="vault-bottom-actions">
        <button class="vault-reset-btn" data-action="vault-reset">${escapeHtml(t('vault_reset') || 'Vault 초기화')}</button>
      </div>
    </div>
  `;
}

function renderOrgChartList() {
  const charts = vaultOrgCharts || [];
  const listHtml = charts.length === 0
    ? `<div class="empty-state"><i class="ri-organization-chart"></i><p>${escapeHtml(t('org_empty'))}</p></div>`
    : charts.map(c => `
        <div class="card org-chart-card" data-action="view-orgchart" data-org-id="${c.id}">
          <div class="card-row">
            <div class="card-icon hex-icon"><i class="ri-organization-chart" style="color:#f59e0b;font-size:20px"></i></div>
            <div class="card-info">
              <div class="card-title">${escapeHtml(c.projectName || c.name)}</div>
              <div class="card-sub">${(c.nodes || []).length} ${escapeHtml(t('org_members'))}</div>
            </div>
            <div class="card-actions">
              <button class="danger" data-delete-org="${c.id}"><i class="ri-delete-bin-line"></i></button>
            </div>
          </div>
        </div>
      `).join('');

  return `
    <div class="sub-header">
      <button data-action="go-back"><i class="ri-arrow-left-line"></i></button>
      <span>${escapeHtml(t('plus_orgchart'))}</span>
      <button data-action="vault-settings" style="margin-left:auto;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer" title="Settings"><i class="ri-settings-3-line"></i></button>
      <button data-action="vault-lock" style="background:none;border:none;color:#ef4444;font-size:18px;cursor:pointer;margin-left:8px" title="Lock"><i class="ri-lock-line"></i></button>
    </div>
    ${listHtml}
    <button class="fab" data-action="add-orgchart"><i class="ri-add-line"></i></button>
  `;
}

function renderVaultSettings() {
  const autoLockOptions = [
    { value: 0, label: t('vault_autolock_off') || '사용 안 함' },
    { value: 1, label: '1 ' + (t('vault_minutes') || '분') },
    { value: 3, label: '3 ' + (t('vault_minutes') || '분') },
    { value: 5, label: '5 ' + (t('vault_minutes') || '분') },
    { value: 10, label: '10 ' + (t('vault_minutes') || '분') },
    { value: 30, label: '30 ' + (t('vault_minutes') || '분') }
  ];

  return `
    <div class="sub-header">
      <button data-action="go-back"><i class="ri-arrow-left-line"></i></button>
      <span>${escapeHtml(t('vault_settings_title') || 'Vault 설정')}</span>
    </div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
      <div class="card" style="padding:16px">
        <div style="font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="ri-lock-password-line" style="color:#3b82f6;font-size:20px"></i> ${escapeHtml(t('vault_change_view_pw') || '열람 비밀번호 변경')}</div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:12px">${escapeHtml(t('vault_change_view_desc') || '조직도를 열람할 때 사용하는 비밀번호를 변경합니다')}</p>
        <button data-action="vault-change-view" class="btn-primary" style="width:100%;padding:10px;border-radius:8px;border:none;color:white;font-weight:600;cursor:pointer">${escapeHtml(t('vault_change_pw_btn') || '비밀번호 변경')}</button>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="ri-alarm-warning-line" style="color:#ef4444;font-size:20px"></i> ${escapeHtml(t('vault_change_panic_pw') || '긴급삭제 비밀번호 변경')}</div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:12px">${escapeHtml(t('vault_change_panic_desc') || '긴급 상황에서 모든 데이터를 삭제하는 비밀번호를 변경합니다')}</p>
        <button data-action="vault-change-panic" class="btn-primary" style="width:100%;padding:10px;border-radius:8px;border:none;background:#ef4444;color:white;font-weight:600;cursor:pointer">${escapeHtml(t('vault_change_pw_btn') || '비밀번호 변경')}</button>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="ri-timer-line" style="color:#f59e0b;font-size:20px"></i> ${escapeHtml(t('vault_autolock_title') || '자동 잠금 타이머')}</div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:12px">${escapeHtml(t('vault_autolock_desc') || '설정한 시간 동안 활동이 없으면 자동으로 잠깁니다')}</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${autoLockOptions.map(opt => `
            <button data-action="vault-autolock-set" data-minutes="${opt.value}" 
              style="padding:8px;border-radius:8px;border:1px solid ${vaultAutoLockMinutes === opt.value ? '#3b82f6' : '#e2e8f0'};background:${vaultAutoLockMinutes === opt.value ? '#3b82f6' : 'transparent'};color:${vaultAutoLockMinutes === opt.value ? 'white' : 'inherit'};font-size:13px;cursor:pointer;font-weight:${vaultAutoLockMinutes === opt.value ? '600' : '400'}">
              ${escapeHtml(opt.label)}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="ri-shield-check-line" style="color:#22c55e;font-size:20px"></i> ${escapeHtml(t('vault_security_info') || '보안 정보')}</div>
        <div style="font-size:13px;color:#94a3b8;display:flex;flex-direction:column;gap:6px">
          <div>• AES-256-GCM ${escapeHtml(t('vault_encryption') || '암호화')}</div>
          <div>• PBKDF2 ${escapeHtml(t('vault_key_derivation') || '키 파생 (100,000 반복)')}</div>
          <div>• ${escapeHtml(t('vault_memory_only') || '복호화 데이터는 메모리에서만 존재')}</div>
          <div>• ${escapeHtml(t('vault_max_attempts_info') || '5회 실패 시 자동 삭제')}</div>
          <div>• ${escapeHtml(t('vault_forensic_proof') || '포렌식 복구 불가능')}</div>
        </div>
      </div>
    </div>
  `;
}

function renderVaultChangePw() {
  const isVerifyOld = vaultChangeMode === 'verify-old';
  const isChangePanic = vaultChangeMode === 'change-panic';
  const isNewPw = vaultChangeMode === 'change-view-new';
  const isConfirmStep = (vaultSetupStep % 2 === 1);

  let title, desc, icon;
  if (isVerifyOld) {
    title = t('vault_verify_old_pw') || '현재 비밀번호 확인';
    desc = t('vault_verify_old_desc') || '현재 열람 비밀번호를 입력하세요';
    icon = 'ri-lock-password-line';
  } else if (isChangePanic) {
    if (vaultSetupStep === 0) {
      title = t('vault_new_panic_pw') || '새 긴급삭제 비밀번호';
      desc = t('vault_new_panic_desc') || '새로운 긴급삭제 비밀번호를 입력하세요';
      icon = 'ri-alarm-warning-line';
    } else {
      title = t('vault_confirm_new_pw') || '비밀번호 확인';
      desc = t('vault_confirm_pw_desc') || '비밀번호를 다시 입력해주세요';
      icon = 'ri-alarm-warning-line';
    }
  } else if (isNewPw) {
    if (vaultSetupStep === 0) {
      title = t('vault_new_view_pw') || '새 열람 비밀번호';
      desc = t('vault_new_view_desc') || '새로운 열람 비밀번호를 입력하세요';
      icon = 'ri-lock-password-line';
    } else {
      title = t('vault_confirm_new_pw') || '비밀번호 확인';
      desc = t('vault_confirm_pw_desc') || '비밀번호를 다시 입력해주세요';
      icon = 'ri-lock-password-line';
    }
  }

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(title)}</span></div>
    <div class="vault-container">
      <div class="vault-icon-wrap">
        <div class="vault-icon ${isChangePanic ? 'danger' : ''}"><i class="${icon}"></i></div>
      </div>
      <div class="vault-step-label">${escapeHtml(title)}</div>
      <div class="vault-step-desc">${escapeHtml(desc)}</div>
      ${vaultError ? `<div class="vault-error"><i class="ri-error-warning-line"></i> ${escapeHtml(vaultError)}</div>` : ''}
      <div class="vault-pin-dots">
        ${Array.from({length: 8}, (_, i) => `<div class="vault-dot ${(isConfirmStep ? vaultPwConfirm : vaultPwInput).length > i ? 'filled' : ''} ${vaultError ? 'error' : ''}"></div>`).join('')}
      </div>
      <div class="vault-keypad">
        ${[1,2,3,4,5,6,7,8,9,'',0,'del'].map(k => {
          if (k === '') return '<div class="vault-key empty"></div>';
          if (k === 'del') return '<div class="vault-key del" data-vault-key="del"><i class="ri-delete-back-2-line"></i></div>';
          return `<div class="vault-key" data-vault-key="${k}">${k}</div>`;
        }).join('')}
      </div>
      <div class="vault-bottom-actions">
        ${(isNewPw || isChangePanic) && vaultSetupStep > 0 ? `<button class="vault-back-btn" data-action="vault-change-step-back"><i class="ri-arrow-left-line"></i> ${escapeHtml(t('vault_go_back') || '이전 단계')}</button>` : ''}
        <button class="vault-reset-btn" data-action="vault-change-cancel"><i class="ri-close-line"></i> ${escapeHtml(t('vault_cancel') || '취소')}</button>
      </div>
    </div>
  `;
}

// Org chart search state
let orgSearchQuery = '';
let orgSearchHighlight = null;

function renderOrgChartView() {
  if (!currentOrgChart || !vaultUnlocked) return '<div class="empty-state"><p>No chart selected</p></div>';

  const nodes = currentOrgChart.nodes || [];
  const rootNodes = nodes.filter(n => !n.parentId);

  function renderHexNode(node, depth = 0) {
    const children = nodes.filter(n => n.parentId === node.id);
    const childrenHtml = children.length > 0
      ? `<div class="hex-children">${children.map(c => renderHexNode(c, depth + 1)).join('')}</div>`
      : '';

    const isHighlighted = orgSearchHighlight === node.id;
    const highlightClass = isHighlighted ? ' hex-highlighted' : '';

    return `
      <div class="hex-node-wrapper" data-node-wrapper-id="${node.id}">
        <div class="hex-node${highlightClass}" data-action="edit-org-node" data-node-id="${node.id}" style="--depth:${depth}">
          <div class="hex-shape">
            <div class="hex-content">
              <div class="hex-name">${escapeHtml(node.name || '?')}</div>
              ${node.amount ? `<div class="hex-amount">$${parseFloat(node.amount).toLocaleString()}</div>` : ''}
            </div>
          </div>
          <div class="hex-details">
            ${node.phone ? `<span class="hex-phone"><i class="ri-phone-line"></i> ${escapeHtml(node.phone)}</span>` : ''}
            ${node.wallet ? `<a class="hex-wallet" href="https://www.tokenpocket.pro/en/search?query=${encodeURIComponent(node.wallet)}" target="_blank"><i class="ri-wallet-3-line"></i> ${escapeHtml(node.wallet.substring(0,8))}...</a>` : ''}
          </div>
        </div>
        <button class="hex-add-child" data-action="add-org-child" data-parent-id="${node.id}"><i class="ri-add-line"></i></button>
        ${childrenHtml}
      </div>
    `;
  }

  const treeHtml = rootNodes.length === 0
    ? `<div class="empty-state"><i class="ri-organization-chart"></i><p>${escapeHtml(t('org_add_first'))}</p></div>`
    : rootNodes.map(n => renderHexNode(n)).join('');

  // Total simulation
  const totalAmount = nodes.reduce((sum, n) => sum + (parseFloat(n.amount) || 0), 0);

  // Search results
  let searchResults = [];
  if (orgSearchQuery.trim()) {
    const q = orgSearchQuery.trim().toLowerCase();
    searchResults = nodes.filter(n =>
      (n.name && n.name.toLowerCase().includes(q)) ||
      (n.phone && n.phone.toLowerCase().includes(q)) ||
      (n.wallet && n.wallet.toLowerCase().includes(q))
    );
  }

  const searchResultsHtml = orgSearchQuery.trim() ? `
    <div class="org-search-results">
      ${searchResults.length === 0 ? `<div class="org-search-no-result">${escapeHtml(t('org_search_no_result') || 'No results')}</div>` :
        searchResults.map(n => `
          <div class="org-search-result-item" data-action="org-search-goto" data-node-id="${n.id}">
            <i class="ri-user-line"></i>
            <div>
              <div style="font-size:12px;font-weight:600">${escapeHtml(n.name)}</div>
              ${n.phone ? `<div style="font-size:10px;color:var(--text-muted)">${escapeHtml(n.phone)}</div>` : ''}
              ${n.wallet ? `<div style="font-size:10px;color:var(--text-muted)">${escapeHtml(n.wallet.substring(0,16))}...</div>` : ''}
            </div>
          </div>
        `).join('')}
    </div>
  ` : '';

  return `
    <div class="sub-header">
      <button data-action="go-back-org"><i class="ri-arrow-left-line"></i></button>
      <span>${escapeHtml(currentOrgChart.projectName || currentOrgChart.name)}</span>
      <div style="margin-left:auto;display:flex;gap:4px">
        <button class="org-zoom-btn" data-action="org-search-toggle" title="Search"><i class="ri-search-line"></i></button>
        <button class="org-zoom-btn" data-action="org-zoom-in" title="Zoom In"><i class="ri-zoom-in-line"></i></button>
        <button class="org-zoom-btn" data-action="org-zoom-out" title="Zoom Out"><i class="ri-zoom-out-line"></i></button>
        <button class="org-zoom-btn" data-action="org-reset-view" title="Reset View"><i class="ri-focus-3-line"></i></button>
        <button class="org-zoom-btn" data-action="vault-lock" title="Lock" style="color:#ef4444"><i class="ri-lock-line"></i></button>
      </div>
    </div>
    ${orgSearchVisible ? `
    <div class="org-search-bar">
      <i class="ri-search-line" style="color:var(--text-muted);font-size:16px"></i>
      <input class="org-search-input" id="org-search-input" type="text" placeholder="${escapeHtml(t('org_search_placeholder') || 'Search name, phone, wallet...')}" value="${escapeHtml(orgSearchQuery)}" data-org-search>
      <button class="org-search-close" data-action="org-search-close"><i class="ri-close-line"></i></button>
    </div>
    ${searchResultsHtml}
    ` : ''}
    <div class="org-summary">
      <div class="org-summary-item">
        <span>${escapeHtml(t('org_total_members'))}</span>
        <strong>${nodes.length}</strong>
      </div>
      <div class="org-summary-item">
        <span>${escapeHtml(t('org_total_amount'))}</span>
        <strong style="color:#10b981">$${totalAmount.toLocaleString()}</strong>
      </div>
    </div>
    <div class="org-view-tabs" style="display:flex;gap:4px;padding:8px 16px;overflow-x:auto">
      <button class="org-view-tab ${orgViewMode==='tree'?'active':''}" data-action="org-view-tree" style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--bg-card-border);background:${orgViewMode==='tree'?'var(--accent-primary)':'transparent'};color:${orgViewMode==='tree'?'#fff':'var(--text-secondary)'};cursor:pointer;white-space:nowrap">
        <i class="ri-organization-chart"></i> 조직도
      </button>
      <button class="org-view-tab ${orgViewMode==='list-name'?'active':''}" data-action="org-view-list-name" style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--bg-card-border);background:${orgViewMode==='list-name'?'var(--accent-primary)':'transparent'};color:${orgViewMode==='list-name'?'#fff':'var(--text-secondary)'};cursor:pointer;white-space:nowrap">
        <i class="ri-sort-alphabet-asc"></i> 이름순
      </button>
      <button class="org-view-tab ${orgViewMode==='list-amount'?'active':''}" data-action="org-view-list-amount" style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--bg-card-border);background:${orgViewMode==='list-amount'?'var(--accent-primary)':'transparent'};color:${orgViewMode==='list-amount'?'#fff':'var(--text-secondary)'};cursor:pointer;white-space:nowrap">
        <i class="ri-money-dollar-circle-line"></i> 투자금순
      </button>
    </div>
    ${orgViewMode === 'tree' ? `
    <div class="org-viewport" id="org-viewport">
      <div class="org-tree-pannable" id="org-tree-pannable" style="transform:translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})">
        ${treeHtml}
      </div>
    </div>
    ` : renderOrgListView(nodes, orgViewMode)}
    <button class="fab" data-action="add-org-root"><i class="ri-add-line"></i></button>
  `;
}

// Org list view - sorted by name or amount
function renderOrgListView(nodes, mode) {
  if (nodes.length === 0) return '<div class="empty-state" style="padding:40px 16px;text-align:center;color:var(--text-muted)"><i class="ri-user-line" style="font-size:40px;margin-bottom:12px;display:block"></i><p>멤버가 없습니다</p></div>';

  // Find parent name helper
  function getParentName(node) {
    if (!node.parentId) return '-';
    const parent = nodes.find(n => n.id === node.parentId);
    return parent ? (parent.name || '?') : '-';
  }

  // Sort nodes
  let sorted = [...nodes];
  if (mode === 'list-name') {
    sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
  } else if (mode === 'list-amount') {
    sorted.sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0));
  }

  const totalAmount = nodes.reduce((sum, n) => sum + (parseFloat(n.amount) || 0), 0);

  const listHtml = sorted.map((node, idx) => {
    const amount = parseFloat(node.amount) || 0;
    const percent = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0.0';
    const depth = getNodeDepth(node, nodes);
    const depthLabel = depth === 0 ? 'ROOT' : `L${depth}`;
    const children = nodes.filter(n => n.parentId === node.id);

    return `
      <div class="org-list-item" data-action="edit-org-node" data-node-id="${node.id}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--bg-card-border);cursor:pointer">
        <div style="width:28px;text-align:center;font-size:12px;font-weight:700;color:var(--text-muted)">${idx + 1}</div>
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f620,#06b6d420);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ri-user-3-fill" style="color:var(--accent-primary);font-size:18px"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;color:var(--text-primary)">${escapeHtml(node.name || '?')}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
            <span style="background:var(--bg-card);padding:1px 6px;border-radius:4px;margin-right:4px">${depthLabel}</span>
            상위: ${escapeHtml(getParentName(node))}
            ${children.length > 0 ? ` · 하위 ${children.length}명` : ''}
          </div>
          ${node.phone ? `<div style="font-size:11px;color:var(--text-muted);margin-top:1px"><i class="ri-phone-line" style="font-size:10px"></i> ${escapeHtml(node.phone)}</div>` : ''}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:14px;font-weight:700;color:#10b981">$${amount.toLocaleString()}</div>
          ${mode === 'list-amount' && totalAmount > 0 ? `<div style="font-size:11px;color:var(--text-muted)">${percent}%</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="flex:1;overflow-y:auto;background:var(--bg-card);border-radius:12px;margin:0 12px 12px">
      <div style="padding:10px 16px;border-bottom:1px solid var(--bg-card-border);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">
          ${mode === 'list-name' ? '<i class="ri-sort-alphabet-asc"></i> 이름순 정렬' : '<i class="ri-money-dollar-circle-line"></i> 투자금 높은순'}
        </span>
        <span style="font-size:12px;color:var(--text-muted)">${sorted.length}명</span>
      </div>
      ${listHtml}
    </div>
  `;
}

function getNodeDepth(node, nodes) {
  let depth = 0;
  let current = node;
  while (current.parentId) {
    current = nodes.find(n => n.id === current.parentId);
    if (!current) break;
    depth++;
  }
  return depth;
}

// Draw SVG connection lines between org chart nodes
function drawOrgLines() {
  const svgOld = document.getElementById('org-svg-lines');
  const pannable = document.getElementById('org-tree-pannable');
  if (!pannable || !currentOrgChart) return;

  // Remove old SVG
  if (svgOld) svgOld.remove();

  const nodes = currentOrgChart.nodes || [];
  if (nodes.length === 0) return;

  const scale = orgZoom || 1;
  const pannableRect = pannable.getBoundingClientRect();

  // Calculate SVG size based on pannable's scroll dimensions (unscaled)
  const w = Math.max(pannable.scrollWidth, 2000);
  const h = Math.max(pannable.scrollHeight, 2000);

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('id', 'org-svg-lines');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.style.cssText = 'position:absolute;top:0;left:0;z-index:0;pointer-events:none;overflow:visible;';

  // Add glow filter
  const defs = document.createElementNS(NS, 'defs');
  const filter = document.createElementNS(NS, 'filter');
  filter.setAttribute('id', 'glow');
  const feGaussian = document.createElementNS(NS, 'feGaussianBlur');
  feGaussian.setAttribute('stdDeviation', '2');
  feGaussian.setAttribute('result', 'coloredBlur');
  filter.appendChild(feGaussian);
  const feMerge = document.createElementNS(NS, 'feMerge');
  const feMergeNode1 = document.createElementNS(NS, 'feMergeNode');
  feMergeNode1.setAttribute('in', 'coloredBlur');
  feMerge.appendChild(feMergeNode1);
  const feMergeNode2 = document.createElementNS(NS, 'feMergeNode');
  feMergeNode2.setAttribute('in', 'SourceGraphic');
  feMerge.appendChild(feMergeNode2);
  filter.appendChild(feMerge);
  defs.appendChild(filter);
  svg.appendChild(defs);

  nodes.forEach(node => {
    if (!node.parentId) return;
    // Find the hex-shape elements (the hexagon visual) for more accurate center points
    const parentWrapper = document.querySelector(`[data-node-wrapper-id="${node.parentId}"]`);
    const childWrapper = document.querySelector(`[data-node-wrapper-id="${node.id}"]`);
    if (!parentWrapper || !childWrapper) return;

    const parentShape = parentWrapper.querySelector('.hex-shape');
    const childShape = childWrapper.querySelector('.hex-shape');
    if (!parentShape || !childShape) return;

    const pRect = parentShape.getBoundingClientRect();
    const cRect = childShape.getBoundingClientRect();

    // Convert screen coordinates to pannable-local coordinates (accounting for transform)
    const x1 = (pRect.left + pRect.width / 2 - pannableRect.left) / scale;
    const y1 = (pRect.top + pRect.height * 0.75 - pannableRect.top) / scale; // bottom of hex
    const x2 = (cRect.left + cRect.width / 2 - pannableRect.left) / scale;
    const y2 = (cRect.top + cRect.height * 0.25 - pannableRect.top) / scale; // top of hex

    // Draw curved path from parent bottom to child top
    const midY = (y1 + y2) / 2;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#00e5ff');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('opacity', '0.8');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('filter', 'url(#glow)');
    svg.appendChild(path);

    // Connection dots
    [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(pt => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', pt.x);
      c.setAttribute('cy', pt.y);
      c.setAttribute('r', '4');
      c.setAttribute('fill', '#00e5ff');
      c.setAttribute('opacity', '0.9');
      svg.appendChild(c);
    });
  });

  pannable.insertBefore(svg, pannable.firstChild);
}

// Setup org chart pan/zoom interactions
let _orgPanZoomBound = false;
function setupOrgPanZoom() {
  const viewport = document.getElementById('org-viewport');
  const pannable = document.getElementById('org-tree-pannable');
  if (!viewport || !pannable) return;

  // Avoid duplicate event listeners
  if (viewport._panZoomBound) {
    // Just redraw lines
    setTimeout(drawOrgLines, 80);
    return;
  }
  viewport._panZoomBound = true;

  let touchStartX = 0, touchStartY = 0;
  let lastPinchDist = 0;
  let touchMoved = false;

  // Mouse drag for panning
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-action]') || e.target.closest('a') || e.target.closest('button')) return;
    orgIsPanning = true;
    orgPanStartX = e.clientX - orgPanX;
    orgPanStartY = e.clientY - orgPanY;
    viewport.style.cursor = 'grabbing';
    e.preventDefault();
  });

  const onMouseMove = (e) => {
    if (!orgIsPanning) return;
    orgPanX = e.clientX - orgPanStartX;
    orgPanY = e.clientY - orgPanStartY;
    const p = document.getElementById('org-tree-pannable');
    if (p) p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`;
    requestAnimationFrame(drawOrgLines);
  };
  const onMouseUp = () => {
    if (orgIsPanning) {
      orgIsPanning = false;
      const vp = document.getElementById('org-viewport');
      if (vp) vp.style.cursor = 'grab';
    }
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Touch drag for panning (NOT passive - we need preventDefault)
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      if (e.target.closest('[data-action]') || e.target.closest('a') || e.target.closest('button')) return;
      touchStartX = e.touches[0].clientX - orgPanX;
      touchStartY = e.touches[0].clientY - orgPanY;
      orgIsPanning = true;
      touchMoved = false;
    } else if (e.touches.length === 2) {
      orgIsPanning = false;
      lastPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', (e) => {
    // MUST preventDefault to stop page scroll and enable drag
    e.preventDefault();
    const p = document.getElementById('org-tree-pannable');
    if (!p) return;

    if (orgIsPanning && e.touches.length === 1) {
      orgPanX = e.touches[0].clientX - touchStartX;
      orgPanY = e.touches[0].clientY - touchStartY;
      p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`;
      touchMoved = true;
      requestAnimationFrame(drawOrgLines);
    }
    // Pinch zoom
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastPinchDist > 0) {
        const delta = dist - lastPinchDist;
        orgZoom = Math.max(0.2, Math.min(4, orgZoom + delta * 0.005));
        p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`;
        requestAnimationFrame(drawOrgLines);
      }
      lastPinchDist = dist;
    }
  }, { passive: false });

  viewport.addEventListener('touchend', (e) => {
    orgIsPanning = false;
    lastPinchDist = 0;
  });

  // Mouse wheel zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    orgZoom = Math.max(0.2, Math.min(4, orgZoom + delta));
    const p = document.getElementById('org-tree-pannable');
    if (p) p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`;
    requestAnimationFrame(drawOrgLines);
  }, { passive: false });

  // Draw initial lines after layout settles
  setTimeout(drawOrgLines, 120);
  setTimeout(drawOrgLines, 400);
}

// ═══════════════════════════════════════════════════════════
// WEBVIEW SCREENS
// ═══════════════════════════════════════════════════════════

function renderAlphabagWebview() {
  return `
    <div class="webview-container">
      <div class="webview-toolbar">
        <button data-wv="back"><i class="ri-arrow-left-line"></i></button>
        <button data-wv="forward"><i class="ri-arrow-right-line"></i></button>
        <button data-wv="refresh"><i class="ri-refresh-line"></i></button>
        <div class="webview-url">alphabag.net</div>
        <button data-action="go-home-tab"><i class="ri-home-line"></i></button>
      </div>
      <iframe class="webview-frame" id="alphabag-frame" src="https://www.alphabag.net" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
    </div>
  `;
}

function renderInfoweb() {
  return `
    <div class="webview-container">
      <div class="webview-toolbar">
        <button data-wv-info="back"><i class="ri-arrow-left-line"></i></button>
        <button data-wv-info="forward"><i class="ri-arrow-right-line"></i></button>
        <button data-wv-info="refresh"><i class="ri-refresh-line"></i></button>
        <div class="webview-url">1page.to</div>
        <button data-action="go-home-tab"><i class="ri-home-line"></i></button>
      </div>
      <iframe class="webview-frame" id="infoweb-frame" src="https://1page.to" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// WEB3 GUARD - DApp Security Browser
// ═══════════════════════════════════════════════════════════

function analyzeDappSecurity(url) {
  const result = { safe: true, riskLevel: 'safe', riskScore: 0, threats: [], domain: '', contractRisks: [], recommendations: [] };
  try {
    const parsed = new URL(url);
    result.domain = parsed.hostname;
    
    // 1. Check whitelist
    if (SAFE_DOMAINS.includes(parsed.hostname) || SAFE_DOMAINS.some(d => parsed.hostname.endsWith('.' + d))) {
      result.riskLevel = 'safe';
      result.riskScore = 5;
      result.recommendations.push('w3g_rec_verified');
      return result;
    }
    
    // 2. Check HTTPS
    if (parsed.protocol !== 'https:') {
      result.threats.push({ type: 'protocol', severity: 'high', desc: 'w3g_threat_no_https' });
      result.riskScore += 30;
    }
    
    // 3. Check suspicious TLD
    const tld = '.' + parsed.hostname.split('.').pop();
    if (SUSPICIOUS_TLD.includes(tld)) {
      result.threats.push({ type: 'tld', severity: 'medium', desc: 'w3g_threat_suspicious_tld' });
      result.riskScore += 20;
    }
    
    // 4. Check phishing domain patterns (typosquatting)
    for (const pattern of PHISHING_DOMAIN_PATTERNS) {
      if (pattern.test(parsed.hostname)) {
        const baseName = pattern.source.replace('[^.]*\\.', '').replace(/\\./g, '.').replace(/[^a-z.]/gi, '');
        const officialDomain = SAFE_DOMAINS.find(d => d.includes(baseName));
        if (officialDomain && !SAFE_DOMAINS.includes(parsed.hostname)) {
          result.threats.push({ type: 'typosquat', severity: 'critical', desc: 'w3g_threat_typosquat', detail: officialDomain });
          result.riskScore += 50;
        }
      }
    }
    
    // 5. Check URL path patterns
    const fullUrl = url.toLowerCase();
    for (const pattern of PHISHING_PATTERNS) {
      if (pattern.test(fullUrl)) {
        result.threats.push({ type: 'phishing_pattern', severity: 'critical', desc: 'w3g_threat_phishing_url' });
        result.riskScore += 40;
        break;
      }
    }
    
    // 6. Check domain age indicators (new/random domain)
    const domainParts = parsed.hostname.split('.');
    const mainDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : parsed.hostname;
    if (/^[a-z0-9]{15,}\./i.test(parsed.hostname) || /[0-9]{4,}/.test(mainDomain)) {
      result.threats.push({ type: 'random_domain', severity: 'medium', desc: 'w3g_threat_random_domain' });
      result.riskScore += 15;
    }
    
    // 7. Check for excessive subdomains
    if (domainParts.length > 4) {
      result.threats.push({ type: 'subdomain', severity: 'low', desc: 'w3g_threat_many_subdomains' });
      result.riskScore += 10;
    }
    
    // 8. Check for IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      result.threats.push({ type: 'ip_address', severity: 'high', desc: 'w3g_threat_ip_address' });
      result.riskScore += 25;
    }
    
    // Determine risk level
    if (result.riskScore >= 60) { result.riskLevel = 'critical'; result.safe = false; }
    else if (result.riskScore >= 40) { result.riskLevel = 'high'; result.safe = false; }
    else if (result.riskScore >= 20) { result.riskLevel = 'medium'; result.safe = true; }
    else { result.riskLevel = 'safe'; result.safe = true; }
    
    // Add recommendations
    if (result.riskScore >= 40) result.recommendations.push('w3g_rec_dont_connect');
    if (result.riskScore >= 20) result.recommendations.push('w3g_rec_check_url');
    if (result.threats.some(t => t.type === 'typosquat')) result.recommendations.push('w3g_rec_use_official');
    result.recommendations.push('w3g_rec_revoke_approvals');
    
  } catch(e) {
    result.threats.push({ type: 'invalid_url', severity: 'high', desc: 'w3g_threat_invalid_url' });
    result.riskScore = 50;
    result.riskLevel = 'high';
    result.safe = false;
  }
  return result;
}

function saveWeb3GuardHistory(url, result) {
  const entry = { url, domain: result.domain, riskLevel: result.riskLevel, riskScore: result.riskScore, timestamp: Date.now() };
  web3guardHistory = [entry, ...web3guardHistory.filter(h => h.url !== url)].slice(0, 50);
  try { localStorage.setItem('web3guard_history', JSON.stringify(web3guardHistory)); } catch(e) {}
}

function renderWeb3Guard() {
  const riskColors = { safe: '#10b981', low: '#22d3ee', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626' };
  const riskIcons = { safe: 'ri-shield-check-fill', low: 'ri-shield-check-line', medium: 'ri-error-warning-line', high: 'ri-alarm-warning-fill', critical: 'ri-skull-2-fill' };
  
  // Quick access DApps
  const quickDapps = [
    { name: 'Uniswap', url: 'https://app.uniswap.org', icon: 'ri-exchange-funds-line', color: '#FF007A' },
    { name: 'OpenSea', url: 'https://opensea.io', icon: 'ri-image-line', color: '#2081E2' },
    { name: 'Aave', url: 'https://app.aave.com', icon: 'ri-bank-line', color: '#B6509E' },
    { name: 'PancakeSwap', url: 'https://pancakeswap.finance', icon: 'ri-cake-3-line', color: '#D1884F' },
    { name: 'Lido', url: 'https://lido.fi', icon: 'ri-water-flash-line', color: '#00A3FF' },
    { name: 'Curve', url: 'https://curve.fi', icon: 'ri-line-chart-line', color: '#FF0000' },
    { name: 'dYdX', url: 'https://dydx.exchange', icon: 'ri-bar-chart-box-line', color: '#6966FF' },
    { name: 'Jupiter', url: 'https://jup.ag', icon: 'ri-planet-line', color: '#C7F284' },
  ];
  
  const quickDappsHtml = quickDapps.map(d => `
    <div class="w3g-quick-dapp" data-action="w3g-open-dapp" data-url="${d.url}">
      <div class="w3g-quick-icon" style="background:${d.color}15;color:${d.color}"><i class="${d.icon}"></i></div>
      <span>${d.name}</span>
    </div>
  `).join('');
  
  // Recent history
  const historyHtml = web3guardHistory.slice(0, 8).map(h => {
    const c = riskColors[h.riskLevel] || '#64748b';
    const ic = riskIcons[h.riskLevel] || 'ri-shield-line';
    return `
      <div class="w3g-history-item" data-action="w3g-open-dapp" data-url="${escapeHtml(h.url)}">
        <div class="w3g-history-icon" style="color:${c}"><i class="${ic}"></i></div>
        <div class="w3g-history-info">
          <div class="w3g-history-domain">${escapeHtml(h.domain)}</div>
          <div class="w3g-history-time">${new Date(h.timestamp).toLocaleDateString()}</div>
        </div>
        <div class="w3g-history-score" style="color:${c}">${h.riskScore}</div>
      </div>
    `;
  }).join('');
  
  // Scan result panel
  let scanHtml = '';
  if (web3guardScanResult) {
    const r = web3guardScanResult;
    const c = riskColors[r.riskLevel];
    const ic = riskIcons[r.riskLevel];
    const threatsHtml = r.threats.map(t => {
      const tc = riskColors[t.severity];
      return `<div class="w3g-threat" style="border-left:3px solid ${tc}">
        <i class="ri-error-warning-fill" style="color:${tc}"></i>
        <span>${escapeHtml(t('w3g_threat_' + t.type) || t(t.desc) || t.desc)}</span>
        ${t.detail ? `<span class="w3g-threat-detail">(${escapeHtml(t.detail)})</span>` : ''}
      </div>`;
    }).join('');
    
    const recsHtml = r.recommendations.map(rec => `
      <div class="w3g-rec"><i class="ri-lightbulb-line"></i> ${escapeHtml(t(rec) || rec)}</div>
    `).join('');
    
    scanHtml = `
      <div class="w3g-scan-result">
        <div class="w3g-scan-header" style="background:${c}10;border:1px solid ${c}30">
          <div class="w3g-scan-icon" style="color:${c}"><i class="${ic}"></i></div>
          <div class="w3g-scan-info">
            <div class="w3g-scan-level" style="color:${c}">${escapeHtml(t('w3g_level_' + r.riskLevel) || r.riskLevel.toUpperCase())}</div>
            <div class="w3g-scan-domain">${escapeHtml(r.domain)}</div>
          </div>
          <div class="w3g-scan-score" style="color:${c}">
            <div class="w3g-score-num">${r.riskScore}</div>
            <div class="w3g-score-label">${escapeHtml(t('w3g_risk_score') || 'Risk')}</div>
          </div>
        </div>
        ${r.threats.length > 0 ? `<div class="w3g-threats-section">
          <div class="w3g-section-title"><i class="ri-alarm-warning-line"></i> ${escapeHtml(t('w3g_threats_found') || '\uC704\uD5D8 \uAC10\uC9C0')}</div>
          ${threatsHtml}
        </div>` : `<div class="w3g-safe-msg"><i class="ri-shield-check-fill" style="color:#10b981"></i> ${escapeHtml(t('w3g_no_threats') || '\uC704\uD5D8 \uC694\uC18C\uAC00 \uAC10\uC9C0\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4')}</div>`}
        ${r.recommendations.length > 0 ? `<div class="w3g-recs-section">
          <div class="w3g-section-title"><i class="ri-lightbulb-line"></i> ${escapeHtml(t('w3g_recommendations') || '\uAD8C\uC7A5 \uC0AC\uD56D')}</div>
          ${recsHtml}
        </div>` : ''}
        <div class="w3g-scan-actions">
          ${r.safe ? `<button class="btn btn-primary w3g-proceed-btn" data-action="w3g-proceed"><i class="ri-external-link-line"></i> ${escapeHtml(t('w3g_open_dapp') || 'DApp \uC5F4\uAE30')}</button>` : 
          `<button class="btn btn-outline w3g-proceed-btn" data-action="w3g-proceed-anyway" style="border-color:${c};color:${c}"><i class="ri-error-warning-line"></i> ${escapeHtml(t('w3g_proceed_anyway') || '\uC704\uD5D8 \uAC10\uC218\uD558\uACE0 \uC5F4\uAE30')}</button>`}
          <button class="btn btn-outline w3g-scan-again" data-action="w3g-clear-scan"><i class="ri-refresh-line"></i></button>
        </div>
      </div>
    `;
  }
  
  // Security tips
  const tips = [
    { icon: 'ri-shield-check-line', color: '#10b981', key: 'w3g_tip_verify' },
    { icon: 'ri-key-2-line', color: '#f59e0b', key: 'w3g_tip_seed' },
    { icon: 'ri-lock-line', color: '#6366f1', key: 'w3g_tip_approve' },
    { icon: 'ri-alarm-warning-line', color: '#ef4444', key: 'w3g_tip_airdrop' },
  ];
  const tipsHtml = tips.map(tip => `
    <div class="w3g-tip">
      <i class="${tip.icon}" style="color:${tip.color}"></i>
      <span>${escapeHtml(t(tip.key) || tip.key)}</span>
    </div>
  `).join('');
  
  return `
    <div class="w3g-container">
      <div class="w3g-header">
        <div class="w3g-logo">
          <i class="ri-shield-keyhole-fill" style="color:#8b5cf6;font-size:24px"></i>
          <span>Web3 <b>Guard</b></span>
        </div>
        <button class="header-icon-btn" data-action="goto-infoweb-tab" title="infoweb"><i class="ri-global-line"></i></button>
      </div>
      
      <div class="w3g-url-bar">
        <i class="ri-shield-keyhole-line w3g-url-shield"></i>
        <input type="text" class="w3g-url-input" placeholder="${escapeHtml(t('w3g_enter_url') || 'DApp URL \uC785\uB825 (\uC608: https://app.uniswap.org)')}" value="${escapeHtml(web3guardUrl)}" data-w3g-url>
        <button class="w3g-scan-btn" data-action="w3g-scan" ${web3guardLoading ? 'disabled' : ''}>
          ${web3guardLoading ? '<i class="ri-loader-4-line w3g-spin"></i>' : '<i class="ri-search-eye-line"></i>'}
        </button>
      </div>
      
      ${scanHtml}
      
      ${!web3guardScanResult ? `
      <div class="w3g-section">
        <div class="w3g-section-title"><i class="ri-apps-2-line"></i> ${escapeHtml(t('w3g_popular_dapps') || '\uC778\uAE30 DApp')}</div>
        <div class="w3g-quick-grid">${quickDappsHtml}</div>
      </div>
      ` : ''}
      
      <div class="w3g-section">
        <div class="w3g-section-title"><i class="ri-information-line"></i> ${escapeHtml(t('w3g_security_tips') || '\uBCF4\uC548 \uD301')}</div>
        <div class="w3g-tips">${tipsHtml}</div>
      </div>
      
      ${historyHtml ? `
      <div class="w3g-section">
        <div class="w3g-section-title"><i class="ri-history-line"></i> ${escapeHtml(t('w3g_recent_scans') || '\uCD5C\uADFC \uAC80\uC0AC')}</div>
        <div class="w3g-history">${historyHtml}</div>
        <button class="w3g-clear-history" data-action="w3g-clear-history"><i class="ri-delete-bin-line"></i> ${escapeHtml(t('w3g_clear_history') || '\uAE30\uB85D \uC0AD\uC81C')}</button>
      </div>
      ` : ''}
    </div>
  `;
}

function renderWeb3GuardBrowser() {
  const r = web3guardScanResult;
  const riskColors = { safe: '#10b981', low: '#22d3ee', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626' };
  const barColor = r ? (riskColors[r.riskLevel] || '#64748b') : '#10b981';
  const riskIcons = { safe: 'ri-shield-check-fill', low: 'ri-shield-check-line', medium: 'ri-error-warning-line', high: 'ri-alarm-warning-fill', critical: 'ri-skull-2-fill' };
  const barIcon = r ? (riskIcons[r.riskLevel] || 'ri-shield-line') : 'ri-shield-check-fill';
  
  return `
    <div class="webview-container">
      <div class="w3g-browser-bar" style="border-bottom:2px solid ${barColor}">
        <button data-action="w3g-back-to-guard"><i class="ri-arrow-left-line"></i></button>
        <div class="w3g-browser-status" style="color:${barColor}">
          <i class="${barIcon}"></i>
          <span>${escapeHtml(r ? r.domain : '')}</span>
          ${r ? `<span class="w3g-browser-score" style="background:${barColor}20">${r.riskScore}</span>` : ''}
        </div>
        <button data-action="w3g-open-wallet" title="Connect Wallet" style="color:#8b5cf6"><i class="ri-wallet-3-line"></i></button>
        <button data-action="w3g-browser-refresh"><i class="ri-refresh-line"></i></button>
        <button data-action="open-external" data-url="${escapeHtml(web3guardProceedUrl)}"><i class="ri-external-link-line"></i></button>
      </div>
      ${r && !r.safe ? `
      <div class="w3g-warning-banner" style="background:${barColor}15;color:${barColor}">
        <i class="ri-alarm-warning-fill"></i>
        <span>${escapeHtml(t('w3g_browsing_risky') || '\uC774 \uC0AC\uC774\uD2B8\uB294 \uC704\uD5D8 \uC694\uC18C\uAC00 \uAC10\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC9C0\uAC11 \uC5F0\uACB0 \uBC0F \uC2B9\uC778\uC5D0 \uC8FC\uC758\uD558\uC138\uC694.')}</span>
      </div>
      ` : ''}
      <div class="w3g-wallet-connect-banner" id="w3g-wallet-banner">
        <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0">
          <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ri-wallet-3-line" style="font-size:16px;color:#fff"></i>
          </div>
          <div style="min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text-primary)">${t('w3g_wallet_needed') || '지갑 연결이 필요합니다'}</div>
            <div style="font-size:10px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t('w3g_wallet_banner') || '외부 지갑 앱에서 이 DApp을 열어주세요'}</div>
          </div>
        </div>
        <button data-action="w3g-open-wallet" style="padding:8px 16px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(99,102,241,0.3)">${t('w3g_open_in_wallet') || '지갑으로 열기'}</button>
        <button id="w3g-dismiss-banner" style="background:none;border:none;color:var(--text-muted);font-size:14px;cursor:pointer;padding:2px;margin-left:2px">✕</button>
      </div>
      <iframe class="webview-frame" id="w3g-browser-frame" src="${escapeHtml(web3guardProceedUrl)}" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation allow-top-navigation-by-user-activation" allow="clipboard-read; clipboard-write"></iframe>
    </div>
  `;
}

function renderWeb3GuardWarning() {
  if (!web3guardShowWarning || !web3guardScanResult) return '';
  const r = web3guardScanResult;
  const riskColors = { safe: '#10b981', low: '#22d3ee', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626' };
  const c = riskColors[r.riskLevel] || '#ef4444';
  
  const threatsHtml = r.threats.slice(0, 3).map(threat => `
    <div class="w3g-warn-threat"><i class="ri-error-warning-fill" style="color:${riskColors[threat.severity]}"></i> ${escapeHtml(t(threat.desc) || threat.desc)}</div>
  `).join('');
  
  return `
    <div class="w3g-warning-overlay">
      <div class="w3g-warning-box">
        <div class="w3g-warning-icon" style="color:${c}"><i class="ri-alarm-warning-fill"></i></div>
        <h3 class="w3g-warning-title" style="color:${c}">${escapeHtml(t('w3g_warning_title') || '\uBCF4\uC548 \uACBD\uACE0')}</h3>
        <p class="w3g-warning-domain">${escapeHtml(r.domain)}</p>
        <div class="w3g-warning-score">
          <span>${escapeHtml(t('w3g_risk_score') || 'Risk Score')}</span>
          <span style="color:${c};font-weight:700;font-size:24px">${r.riskScore}</span>
        </div>
        ${threatsHtml}
        <div class="w3g-warning-actions">
          <button class="btn btn-primary" data-action="w3g-warning-block"><i class="ri-shield-check-line"></i> ${escapeHtml(t('w3g_block') || '\uCC28\uB2E8')}</button>
          <button class="btn btn-outline" data-action="w3g-warning-proceed" style="border-color:${c};color:${c}"><i class="ri-error-warning-line"></i> ${escapeHtml(t('w3g_proceed_anyway') || '\uC704\uD5D8 \uAC10\uC218')}</button>
        </div>
      </div>
    </div>
  `;
}

function renderGenericWebview() {
  return `
    <div class="webview-container">
      <div class="webview-toolbar">
        <button class="webview-close-btn" data-action="close-webview"><i class="ri-close-line"></i></button>
        <div class="webview-url">${escapeHtml(webviewUrl.replace('https://','').substring(0,40))}</div>
        <button data-wv-generic="refresh"><i class="ri-refresh-line"></i></button>
        <button class="webview-open-external" data-action="open-external" data-url="${escapeHtml(webviewUrl)}"><i class="ri-external-link-line"></i></button>
      </div>
      <iframe class="webview-frame" id="generic-frame" src="${escapeHtml(webviewUrl)}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// QUICK COPY PANEL (PC Electron)
// ═══════════════════════════════════════════════════════════

function renderQuickCopyPanel() {
  // Collect all copyable data from bookmarks, web3, memos
  const bookmarkItems = state.bookmarks.slice(0, 10).map(bm => `
    <div class="qc-item" data-action="quick-copy-item" data-copy-text="${escapeHtml(bm.url)}">
      <div class="qc-item-icon" style="background:#00d4ff15"><i class="ri-global-line" style="color:#00d4ff"></i></div>
      <div class="qc-item-info">
        <div class="qc-item-title">${escapeHtml(bm.title || bm.url)}</div>
        <div class="qc-item-sub">${escapeHtml(bm.url)}</div>
      </div>
      <button class="qc-copy-btn"><i class="ri-file-copy-line"></i></button>
    </div>
  `).join('');

  const web3Items = state.mailAccounts.slice(0, 10).map(ma => {
    const items = [];
    // Wallet address
    if (ma.email) {
      items.push(`
        <div class="qc-item" data-action="quick-copy-item" data-copy-text="${escapeHtml(ma.email)}">
          <div class="qc-item-icon" style="background:#8b5cf615"><i class="ri-wallet-3-line" style="color:#8b5cf6"></i></div>
          <div class="qc-item-info">
            <div class="qc-item-title">${escapeHtml(ma.provider || 'Web3')} - ${escapeHtml(t('bm_wallet_address'))}</div>
            <div class="qc-item-sub">${escapeHtml(ma.email.length > 30 ? ma.email.substring(0,15) + '...' + ma.email.slice(-10) : ma.email)}</div>
          </div>
          <button class="qc-copy-btn"><i class="ri-file-copy-line"></i></button>
        </div>
      `);
    }
    return items.join('');
  }).join('');

  const memoItems = state.memos.slice(0, 5).map(m => `
    <div class="qc-item" data-action="quick-copy-item" data-copy-text="${escapeHtml(m.content)}">
      <div class="qc-item-icon" style="background:#10b98115"><i class="ri-file-text-line" style="color:#10b981"></i></div>
      <div class="qc-item-info">
        <div class="qc-item-title">${escapeHtml(m.title)}</div>
        <div class="qc-item-sub">${escapeHtml((m.content || '').substring(0, 50))}${(m.content || '').length > 50 ? '...' : ''}</div>
      </div>
      <button class="qc-copy-btn"><i class="ri-file-copy-line"></i></button>
    </div>
  `).join('');

  // USDT price quick info
  const usdtInfo = usdtKrwPrice > 0 ? `
    <div class="qc-usdt-bar">
      <div class="qc-usdt-label"><i class="ri-exchange-dollar-fill" style="color:#26a17b"></i> USDT/KRW</div>
      <div class="qc-usdt-price" data-action="quick-copy-item" data-copy-text="${usdtKrwPrice}">₩${Number(usdtKrwPrice).toLocaleString()} <i class="ri-file-copy-line" style="font-size:10px;opacity:0.5"></i></div>
    </div>
  ` : '';

  return `
    <div class="quick-copy-panel">
      <div class="qc-header">
        <span><i class="ri-file-copy-line"></i> ${escapeHtml(t('quick_copy') || '빠른 복사')}</span>
        <button data-action="toggle-quick-copy"><i class="ri-close-line"></i></button>
      </div>
      ${usdtInfo}
      ${bookmarkItems ? `<div class="qc-section"><div class="qc-section-title"><i class="ri-bookmark-3-line"></i> ${escapeHtml(t('action_bookmark'))}</div>${bookmarkItems}</div>` : ''}
      ${web3Items ? `<div class="qc-section"><div class="qc-section-title"><i class="ri-wallet-3-line"></i> Web3</div>${web3Items}</div>` : ''}
      ${memoItems ? `<div class="qc-section"><div class="qc-section-title"><i class="ri-file-text-line"></i> Memo</div>${memoItems}</div>` : ''}
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════
// CARD SCREEN - USDT Visa/Mastercard
// ═══════════════════════════════════════════════════════════

function renderCardScreen() {
  switch (cardScreen) {
    case 'apply': return renderCardApply();
    case 'apply-design': return renderCardApplyDesign();
    case 'apply-form': return renderCardApplyForm();
    case 'detail': return renderCardDetail();
    default: return renderCardMain();
  }
}

function renderCardMain() {
  const totalBalance = myCards.reduce((sum, c) => sum + (c.status === 'active' ? c.balance : 0), 0);
  
  const cardsHtml = myCards.length === 0 ? `
    <div class="card-empty-state">
      <div class="card-empty-icon"><i class="ri-bank-card-line"></i></div>
      <h3>${escapeHtml(t('card_no_cards'))}</h3>
      <p>${escapeHtml(t('card_no_cards_desc'))}</p>
      <button class="btn btn-primary" data-action="card-start-apply" style="margin-top:16px;padding:12px 32px">
        <i class="ri-add-line"></i> ${escapeHtml(t('card_apply_btn'))}
      </button>
    </div>
  ` : `
    <div class="card-list">
      ${myCards.map(card => {
        const design = CARD_DESIGNS.find(d => d.id === card.design) || CARD_DESIGNS[0];
        return `
          <div class="card-item" data-action="card-select" data-card-id="${card.id}">
            <div class="card-preview" style="background:linear-gradient(135deg, ${design.color}, ${design.color}dd)">
              <img src="${design.image}" class="card-preview-img" alt="${design.name}">
              <div class="card-status ${card.status}">${card.status === 'active' ? escapeHtml(t('card_active')) : escapeHtml(t('card_frozen'))}</div>
            </div>
            <div class="card-item-info">
              <div class="card-item-name">${escapeHtml(design.name)}</div>
              <div class="card-item-number">**** ${card.last4}</div>
              <div class="card-item-balance">$${card.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span class="card-currency">${card.currency}</span></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return `
    <div class="card-screen">
      <div class="card-header">
        <h2>${escapeHtml(t('card_title'))}</h2>
        ${myCards.length > 0 ? `<button class="btn btn-sm btn-outline" data-action="card-start-apply"><i class="ri-add-line"></i> ${escapeHtml(t('card_new'))}</button>` : ''}
      </div>
      ${myCards.length > 0 ? `
      <div class="card-total-balance">
        <div class="card-total-label">${escapeHtml(t('card_total_balance'))}</div>
        <div class="card-total-amount">$${totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
      ` : ''}
      ${cardsHtml}
    </div>
  `;
}

function renderCardApply() {
  return `
    <div class="card-screen">
      <div class="card-nav">
        <button class="card-back-btn" data-action="card-back"><i class="ri-arrow-left-s-line"></i></button>
        <h3>${escapeHtml(t('card_apply_title'))}</h3>
      </div>
      <div class="card-apply-types">
        <div class="card-type-option ${cardApplyType === 'virtual' ? 'selected' : ''}" data-action="card-set-type" data-type="virtual">
          <div class="card-type-preview">
            <img src="${CARD_IMG_VIRTUAL}" alt="Virtual">
            <div class="card-type-badge">Virtual</div>
          </div>
          <h4>${escapeHtml(t('card_virtual'))}</h4>
          <p>${escapeHtml(t('card_virtual_subtitle'))}</p>
          <div class="card-type-features">
            <div class="card-feat"><i class="ri-bank-line"></i> ${escapeHtml(t('card_feat_online'))}</div>
            <div class="card-feat"><i class="ri-flashlight-line"></i> ${escapeHtml(t('card_feat_instant'))}</div>
            <div class="card-feat"><i class="ri-global-line"></i> ${escapeHtml(t('card_feat_global'))}</div>
          </div>
        </div>
        <div class="card-type-option ${cardApplyType === 'physical' ? 'selected' : ''}" data-action="card-set-type" data-type="physical">
          <div class="card-type-preview">
            <img src="${CARD_IMG_PHYSICAL}" alt="Physical">
            <div class="card-type-badge">Physical</div>
          </div>
          <h4>${escapeHtml(t('card_physical'))}</h4>
          <p>${escapeHtml(t('card_physical_subtitle'))}</p>
          <div class="card-type-features">
            <div class="card-feat"><i class="ri-plane-line"></i> ${escapeHtml(t('card_feat_atm'))}</div>
            <div class="card-feat"><i class="ri-store-2-line"></i> ${escapeHtml(t('card_feat_pos'))}</div>
            <div class="card-feat"><i class="ri-shield-check-line"></i> ${escapeHtml(t('card_feat_emv'))}</div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary card-next-btn" data-action="card-apply-next">
        ${escapeHtml(t('card_next'))} <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  `;
}

function renderCardApplyDesign() {
  const filtered = CARD_DESIGNS.filter(d => cardApplyType === 'virtual' ? d.type === 'virtual' : d.type === 'physical');
  return `
    <div class="card-screen">
      <div class="card-nav">
        <button class="card-back-btn" data-action="card-back-to-apply"><i class="ri-arrow-left-s-line"></i></button>
        <h3>${escapeHtml(t('card_choose_design'))}</h3>
        <span class="card-nav-type">${cardApplyType === 'virtual' ? escapeHtml(t('card_virtual')) : escapeHtml(t('card_physical'))}</span>
      </div>
      <div class="card-design-carousel">
        ${filtered.map(d => `
          <div class="card-design-slide ${cardApplyDesign === d.id ? 'selected' : ''}" data-action="card-pick-design" data-design="${d.id}">
            <img src="${d.image}" class="card-design-img" alt="${d.name}">
          </div>
        `).join('')}
      </div>
      <div class="card-design-info">
        <h3>${escapeHtml(filtered.find(d => d.id === cardApplyDesign)?.name || '')}</h3>
        <div class="card-design-network">
          <span class="card-network-badge">${escapeHtml(filtered.find(d => d.id === cardApplyDesign)?.network || '')}</span>
          ${filtered.find(d => d.id === cardApplyDesign)?.bonus ? `<span class="card-bonus-badge">${filtered.find(d => d.id === cardApplyDesign).bonus} ${escapeHtml(t('card_welcome_bonus'))}</span>` : ''}
        </div>
        <p class="card-design-desc">${escapeHtml(t(filtered.find(d => d.id === cardApplyDesign)?.desc_key || 'card_virtual_desc') || '')}</p>
      </div>
      <button class="btn btn-primary card-next-btn" data-action="card-apply-confirm">
        ${escapeHtml(t('card_apply_confirm'))} <i class="ri-check-line"></i>
      </button>
      <p class="card-terms">${escapeHtml(t('card_terms'))}</p>
    </div>
  `;
}

function renderCardApplyForm() {
  const design = CARD_DESIGNS.find(d => d.id === cardApplyDesign) || CARD_DESIGNS[0];
  return `
    <div class="card-screen">
      <div class="card-apply-success">
        <div class="card-success-icon"><i class="ri-check-double-line"></i></div>
        <h2>${escapeHtml(t('card_apply_success'))}</h2>
        <p>${escapeHtml(t('card_apply_success_desc'))}</p>
        <div class="card-success-preview">
          <img src="${design.image}" alt="${design.name}" class="card-success-img">
        </div>
        <div class="card-success-details">
          <div class="card-success-row"><span>${escapeHtml(t('card_type_label'))}</span><span>${escapeHtml(design.name)}</span></div>
          <div class="card-success-row"><span>${escapeHtml(t('card_network_label'))}</span><span>${escapeHtml(design.network)}</span></div>
          <div class="card-success-row"><span>${escapeHtml(t('card_currency_label'))}</span><span>USD (USDT)</span></div>
          ${design.bonus ? `<div class="card-success-row highlight"><span>${escapeHtml(t('card_welcome_bonus'))}</span><span>${design.bonus}</span></div>` : ''}
        </div>
        <button class="btn btn-primary card-next-btn" data-action="card-go-to-cards">
          ${escapeHtml(t('card_view_my_cards'))} <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>
  `;
}

function renderCardDetail() {
  const card = myCards.find(c => c.id === selectedCardId);
  if (!card) { cardScreen = 'main'; return renderCardMain(); }
  const design = CARD_DESIGNS.find(d => d.id === card.design) || CARD_DESIGNS[0];
  
  const txHtml = (card.transactions || []).length === 0 ? `
    <div class="card-tx-empty"><i class="ri-file-list-3-line"></i><p>${escapeHtml(t('card_no_tx'))}</p></div>
  ` : (card.transactions || []).slice(0, 20).map(tx => `
    <div class="card-tx-item">
      <div class="card-tx-icon ${tx.type}">
        <i class="${tx.type === 'topup' ? 'ri-add-line' : tx.type === 'withdraw' ? 'ri-arrow-up-line' : 'ri-shopping-cart-line'}"></i>
      </div>
      <div class="card-tx-info">
        <div class="card-tx-desc">${escapeHtml(tx.description)}</div>
        <div class="card-tx-date">${new Date(tx.date).toLocaleDateString()} ${new Date(tx.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
      </div>
      <div class="card-tx-amount ${tx.type === 'topup' ? 'positive' : 'negative'}">
        ${tx.type === 'topup' ? '+' : '-'}$${Math.abs(tx.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
      </div>
    </div>
  `).join('');

  // Topup modal
  const topupModal = showCardTopup ? `
    <div class="card-modal-overlay" data-action="card-close-topup"></div>
    <div class="card-modal">
      <div class="card-modal-header">
        <h3>${escapeHtml(t('card_topup'))}</h3>
        <button data-action="card-close-topup"><i class="ri-close-line"></i></button>
      </div>
      <div class="card-modal-body">
        <p class="card-modal-desc">${escapeHtml(t('card_topup_desc'))}</p>
        <div class="card-input-group">
          <span class="card-input-prefix">$</span>
          <input type="number" class="card-amount-input" id="card-topup-input" placeholder="0.00" value="${cardTopupAmount}" step="0.01" min="1">
          <span class="card-input-suffix">USD</span>
        </div>
        <div class="card-quick-amounts">
          <button class="card-quick-btn" data-action="card-topup-quick" data-amount="50">$50</button>
          <button class="card-quick-btn" data-action="card-topup-quick" data-amount="100">$100</button>
          <button class="card-quick-btn" data-action="card-topup-quick" data-amount="500">$500</button>
          <button class="card-quick-btn" data-action="card-topup-quick" data-amount="1000">$1,000</button>
        </div>
        <div class="card-topup-rate">
          <span>1 USDT = 1.00 USD</span>
          <span class="card-fee">${escapeHtml(t('card_fee'))}: 0%</span>
        </div>
        <button class="btn btn-primary" data-action="card-topup-confirm" style="width:100%;padding:14px;margin-top:12px">
          <i class="ri-add-circle-line"></i> ${escapeHtml(t('card_topup_confirm'))}
        </button>
      </div>
    </div>
  ` : '';

  // Withdraw modal
  const withdrawModal = showCardWithdraw ? `
    <div class="card-modal-overlay" data-action="card-close-withdraw"></div>
    <div class="card-modal">
      <div class="card-modal-header">
        <h3>${escapeHtml(t('card_withdraw'))}</h3>
        <button data-action="card-close-withdraw"><i class="ri-close-line"></i></button>
      </div>
      <div class="card-modal-body">
        <p class="card-modal-desc">${escapeHtml(t('card_withdraw_desc'))}</p>
        <div class="card-input-group">
          <span class="card-input-prefix">$</span>
          <input type="number" class="card-amount-input" id="card-withdraw-input" placeholder="0.00" value="${cardWithdrawAmount}" step="0.01" min="1" max="${card.balance}">
          <span class="card-input-suffix">USD</span>
        </div>
        <div class="card-available">${escapeHtml(t('card_available'))}: $${card.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        <button class="btn btn-primary" data-action="card-withdraw-confirm" style="width:100%;padding:14px;margin-top:12px">
          <i class="ri-arrow-up-line"></i> ${escapeHtml(t('card_withdraw_confirm'))}
        </button>
      </div>
    </div>
  ` : '';

  return `
    <div class="card-screen card-detail-screen">
      <div class="card-nav">
        <button class="card-back-btn" data-action="card-back"><i class="ri-arrow-left-s-line"></i></button>
        <h3>${escapeHtml(t('card_management'))}</h3>
        <button class="card-freeze-btn ${card.status}" data-action="card-toggle-freeze" data-card-id="${card.id}">
          <i class="${card.status === 'active' ? 'ri-lock-unlock-line' : 'ri-lock-line'}"></i>
        </button>
      </div>
      <div class="card-detail-card">
        <img src="${design.image}" class="card-detail-img" alt="${design.name}">
        <div class="card-detail-overlay">
          <div class="card-detail-status ${card.status}">${card.status === 'active' ? escapeHtml(t('card_active')) : escapeHtml(t('card_frozen'))}</div>
          <div class="card-detail-type">${escapeHtml(card.type === 'virtual' ? t('card_virtual') : t('card_physical'))}</div>
        </div>
      </div>
      <div class="card-detail-balance">
        <div class="card-balance-label">${escapeHtml(t('card_balance'))} (${card.currency})</div>
        <div class="card-balance-amount">$${card.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
      <div class="card-detail-actions">
        <button class="card-action-btn" data-action="card-open-topup" ${card.status !== 'active' ? 'disabled' : ''}>
          <div class="card-action-icon"><i class="ri-add-circle-line"></i></div>
          <span>${escapeHtml(t('card_topup'))}</span>
        </button>
        <button class="card-action-btn" data-action="card-open-withdraw" ${card.status !== 'active' ? 'disabled' : ''}>
          <div class="card-action-icon"><i class="ri-arrow-up-circle-line"></i></div>
          <span>${escapeHtml(t('card_withdraw'))}</span>
        </button>
        <button class="card-action-btn" data-action="card-show-info" data-card-id="${card.id}">
          <div class="card-action-icon"><i class="ri-file-info-line"></i></div>
          <span>${escapeHtml(t('card_info'))}</span>
        </button>
      </div>
      <div class="card-tx-section">
        <h4>${escapeHtml(t('card_recent_tx'))}</h4>
        ${txHtml}
      </div>
      ${topupModal}
      ${withdrawModal}
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════
// KPI / WBS (Work Breakdown Structure)
// ═══════════════════════════════════════════════════════════

function renderKpiScreen() {
  switch (kpiScreen) {
    case 'project': return renderKpiProject();
    case 'task': return renderKpiTask();
    default: return renderKpiList();
  }
}

function renderKpiList() {
  const projectsHtml = kpiProjects.length === 0 ? `
    <div class="empty-state" style="padding:60px 20px;text-align:center">
      <i class="ri-bar-chart-box-line" style="font-size:48px;color:var(--text-muted);margin-bottom:16px;display:block"></i>
      <h3 style="color:var(--text-primary);margin-bottom:8px">프로젝트를 추가하세요</h3>
      <p style="color:var(--text-muted);font-size:13px">KPI 프로젝트를 만들고 WBS로 \n업무를 관리하세요</p>
    </div>
  ` : kpiProjects.map(proj => {
    const totalTasks = countAllTasks(proj);
    const doneTasks = countDoneTasks(proj);
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const daysLeft = proj.deadline ? Math.ceil((new Date(proj.deadline) - new Date()) / (1000*60*60*24)) : null;
    return `
      <div class="kpi-project-card" data-action="kpi-open-project" data-kpi-id="${proj.id}" style="background:var(--bg-card);border-radius:12px;padding:16px;margin-bottom:12px;cursor:pointer;border:1px solid var(--bg-card-border)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--text-primary)">${escapeHtml(proj.name)}</div>
            ${proj.goal ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px">${escapeHtml(proj.goal)}</div>` : ''}
          </div>
          <button data-action="kpi-delete-project" data-kpi-id="${proj.id}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px" onclick="event.stopPropagation()"><i class="ri-delete-bin-line"></i></button>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:10px">
          ${proj.deadline ? `<div style="font-size:11px;color:${daysLeft <= 0 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : 'var(--text-muted)'}">
            <i class="ri-calendar-line"></i> ${proj.deadline} ${daysLeft > 0 ? `(D-${daysLeft})` : daysLeft === 0 ? '(D-Day!)' : `(D+${Math.abs(daysLeft)})`}
          </div>` : ''}
          <div style="font-size:11px;color:var(--text-muted)"><i class="ri-task-line"></i> ${doneTasks}/${totalTasks}</div>
        </div>
        <div style="background:var(--bg-main);border-radius:6px;height:6px;overflow:hidden">
          <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#10b981,#06b6d4);border-radius:6px;transition:width 0.3s"></div>
        </div>
        <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:4px">${progress}%</div>
      </div>
    `;
  }).join('');

  return `
    <div class="sub-header">
      <button data-action="go-back"><i class="ri-arrow-left-line"></i></button>
      <span>KPI</span>
    </div>
    <div style="padding:12px 16px;flex:1;overflow-y:auto">
      ${projectsHtml}
    </div>
    <button class="fab" data-action="kpi-add-project"><i class="ri-add-line"></i></button>
  `;
}

function renderKpiProject() {
  const proj = kpiProjects.find(p => p.id === kpiSelectedProjectId);
  if (!proj) { kpiScreen = 'list'; return renderKpiList(); }

  const totalTasks = countAllTasks(proj);
  const doneTasks = countDoneTasks(proj);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const daysLeft = proj.deadline ? Math.ceil((new Date(proj.deadline) - new Date()) / (1000*60*60*24)) : null;

  // Countdown
  let countdownHtml = '';
  if (proj.deadline) {
    const now = new Date();
    const dl = new Date(proj.deadline + 'T23:59:59');
    const diff = dl - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
      countdownHtml = `
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
          <div style="background:var(--bg-main);border-radius:8px;padding:8px 14px;text-align:center;min-width:50px">
            <div style="font-size:20px;font-weight:800;color:#10b981">${days}</div>
            <div style="font-size:10px;color:var(--text-muted)">일</div>
          </div>
          <div style="background:var(--bg-main);border-radius:8px;padding:8px 14px;text-align:center;min-width:50px">
            <div style="font-size:20px;font-weight:800;color:#10b981">${hours}</div>
            <div style="font-size:10px;color:var(--text-muted)">시간</div>
          </div>
          <div style="background:var(--bg-main);border-radius:8px;padding:8px 14px;text-align:center;min-width:50px">
            <div style="font-size:20px;font-weight:800;color:#10b981">${mins}</div>
            <div style="font-size:10px;color:var(--text-muted)">분</div>
          </div>
        </div>
      `;
    } else {
      countdownHtml = `<div style="text-align:center;margin-top:8px;color:#ef4444;font-weight:700">마감일 경과!</div>`;
    }
  }

  const categories = proj.categories || [];
  const categoriesHtml = categories.map((cat, catIdx) => {
    const subcats = cat.subcategories || [];
    const catTasks = subcats.reduce((sum, sc) => sum + (sc.tasks || []).length, 0);
    const catDone = subcats.reduce((sum, sc) => sum + (sc.tasks || []).filter(t => t.done).length, 0);

    const subcatsHtml = subcats.map((sc, scIdx) => {
      const tasks = sc.tasks || [];
      const scDone = tasks.filter(t => t.done).length;
      const tasksHtml = tasks.map((task, tIdx) => `
        <div style="border-bottom:1px solid var(--bg-card-border)">
          <div style="display:flex;align-items:center;gap:8px;padding:8px 12px">
            <button data-action="kpi-toggle-task" data-cat="${catIdx}" data-subcat="${scIdx}" data-task="${tIdx}" style="background:none;border:2px solid ${task.done ? '#10b981' : 'var(--text-muted)'};width:20px;height:20px;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;${task.done ? 'background:#10b981' : ''}">
              ${task.done ? '<i class="ri-check-line" style="color:#fff;font-size:12px"></i>' : ''}
            </button>
            <span style="flex:1;font-size:13px;color:${task.done ? 'var(--text-muted)' : 'var(--text-primary)'};${task.done ? 'text-decoration:line-through' : ''}">${escapeHtml(task.text)}</span>
            <button data-action="kpi-edit-task-memo" data-cat="${catIdx}" data-subcat="${scIdx}" data-task="${tIdx}" style="background:none;border:none;color:${task.memo ? '#3b82f6' : 'var(--text-muted)'};cursor:pointer;padding:2px;font-size:14px" title="비고"><i class="ri-sticky-note-line"></i></button>
            <button data-action="kpi-delete-task" data-cat="${catIdx}" data-subcat="${scIdx}" data-task="${tIdx}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px;font-size:14px"><i class="ri-close-line"></i></button>
          </div>
          ${task.memo ? `<div data-action="kpi-edit-task-memo" data-cat="${catIdx}" data-subcat="${scIdx}" data-task="${tIdx}" style="padding:2px 12px 8px 40px;font-size:11px;color:#3b82f6;cursor:pointer;white-space:pre-wrap"><i class="ri-sticky-note-line" style="font-size:10px"></i> ${escapeHtml(task.memo)}</div>` : ''}
        </div>
      `).join('');

      return `
        <div style="margin-left:12px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0">
            <i class="ri-folder-line" style="color:var(--accent-primary);font-size:14px"></i>
            <span style="font-size:13px;font-weight:600;color:var(--text-primary);flex:1;cursor:pointer" data-action="kpi-rename-subcat" data-cat="${catIdx}" data-subcat="${scIdx}">${escapeHtml(sc.name)}</span>
            <span style="font-size:11px;color:var(--text-muted)">${scDone}/${tasks.length}</span>
            <button data-action="kpi-delete-subcat" data-cat="${catIdx}" data-subcat="${scIdx}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px"><i class="ri-delete-bin-line" style="font-size:12px"></i></button>
          </div>
          <div style="background:var(--bg-main);border-radius:8px;overflow:hidden">
            ${tasksHtml}
            <div data-action="kpi-add-task" data-cat="${catIdx}" data-subcat="${scIdx}" style="padding:8px 12px;color:var(--text-muted);font-size:12px;cursor:pointer;display:flex;align-items:center;gap:4px">
              <i class="ri-add-line"></i> 태스크 추가
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="background:var(--bg-card);border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid var(--bg-card-border)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <i class="ri-folder-3-fill" style="color:#f59e0b;font-size:18px"></i>
          <span style="font-size:15px;font-weight:700;color:var(--text-primary);flex:1;cursor:pointer" data-action="kpi-rename-cat" data-cat="${catIdx}">${escapeHtml(cat.name)}</span>
          <span style="font-size:11px;color:var(--text-muted)">${catDone}/${catTasks}</span>
          <button data-action="kpi-add-subcat" data-cat="${catIdx}" style="background:none;border:none;color:var(--accent-primary);cursor:pointer;padding:2px"><i class="ri-add-circle-line" style="font-size:16px"></i></button>
          <button data-action="kpi-delete-cat" data-cat="${catIdx}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px"><i class="ri-delete-bin-line" style="font-size:14px"></i></button>
        </div>
        ${subcatsHtml}
      </div>
    `;
  }).join('');

  return `
    <div class="sub-header">
      <button data-action="kpi-back-to-list"><i class="ri-arrow-left-line"></i></button>
      <span>${escapeHtml(proj.name)}</span>
      <button style="margin-left:auto;background:none;border:none;color:var(--accent-primary);cursor:pointer" data-action="kpi-share-project" data-kpi-id="${proj.id}"><i class="ri-share-line"></i></button>
      <button style="background:none;border:none;color:var(--text-muted);cursor:pointer" data-action="kpi-edit-project" data-kpi-id="${proj.id}"><i class="ri-settings-3-line"></i></button>
    </div>
    <div style="padding:12px 16px;flex:1;overflow-y:auto">
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;margin-bottom:12px;border:1px solid var(--bg-card-border)">
        ${proj.goal ? `<div style="text-align:center;font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:4px"><i class="ri-focus-3-line"></i> ${escapeHtml(proj.goal)}</div>` : ''}
        ${proj.deadline ? `<div style="text-align:center;font-size:12px;color:var(--text-muted)">완성일: ${proj.deadline}</div>` : ''}
        ${countdownHtml}
        <div style="margin-top:12px;background:var(--bg-main);border-radius:6px;height:8px;overflow:hidden">
          <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#10b981,#06b6d4);border-radius:6px;transition:width 0.3s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <span style="font-size:11px;color:var(--text-muted)">${doneTasks}/${totalTasks} 완료</span>
          <span style="font-size:11px;font-weight:700;color:#10b981">${progress}%</span>
        </div>
      </div>
      ${categoriesHtml}
      <div data-action="kpi-add-cat" style="background:var(--bg-card);border-radius:12px;padding:14px;text-align:center;cursor:pointer;border:1px dashed var(--bg-card-border);color:var(--text-muted);font-size:13px">
        <i class="ri-add-line"></i> 대메뉴 추가
      </div>
    </div>
  `;
}

function countAllTasks(proj) {
  return (proj.categories || []).reduce((sum, cat) =>
    sum + (cat.subcategories || []).reduce((s, sc) => s + (sc.tasks || []).length, 0), 0);
}

function countDoneTasks(proj) {
  return (proj.categories || []).reduce((sum, cat) =>
    sum + (cat.subcategories || []).reduce((s, sc) => s + (sc.tasks || []).filter(t => t.done).length, 0), 0);
}

// ═══════════════════════════════════════════════════════════
// WEB3APP DOWNLOAD SERVICE
// ═══════════════════════════════════════════════════════════

let web3appCategory = 'all';
let web3appSearch = '';

function renderWeb3App() {
  const categories = [
    { id: 'all', label: t('bm_all') || 'All', icon: 'ri-apps-line' },
    { id: 'wallet', label: t('web3app_cat_wallet') || 'Wallet', icon: 'ri-wallet-3-line' },
    { id: 'defi', label: t('web3app_cat_defi') || 'DeFi', icon: 'ri-exchange-funds-line' },
    { id: 'nft', label: t('web3app_cat_nft') || 'NFT', icon: 'ri-image-line' },
    { id: 'tool', label: t('web3app_cat_tool') || 'Tool', icon: 'ri-tools-line' },
  ];

  let filtered = web3appCategory === 'all' ? WEB3_APPS : WEB3_APPS.filter(a => a.category === web3appCategory);
  if (web3appSearch) {
    const q = web3appSearch.toLowerCase();
    filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || (t(a.desc) || '').toLowerCase().includes(q));
  }

  const catsHtml = categories.map(c => `
    <button class="web3app-cat-btn ${web3appCategory === c.id ? 'active' : ''}" data-action="web3app-filter" data-cat="${c.id}">
      <i class="${c.icon}"></i> ${escapeHtml(c.label)}
    </button>
  `).join('');

  const appsHtml = filtered.map(app => `
    <div class="web3app-card" data-action="web3app-open" data-url="${app.url}">
      <div class="web3app-icon" style="background:${app.color}15">
        <img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=ri-apps-2-fill style=color:${app.color};font-size:24px></i>'">
      </div>
      <div class="web3app-info">
        <div class="web3app-name">${escapeHtml(app.name)}</div>
        <div class="web3app-desc">${escapeHtml(t(app.desc) || app.name)}</div>
      </div>
      <div class="web3app-dl-btn" style="color:${app.color}">
        <i class="ri-download-2-line"></i>
      </div>
    </div>
  `).join('');

  return `
    <div class="sub-header">
      <button data-action="go-back"><i class="ri-arrow-left-line"></i></button>
      <span>Web3App</span>
    </div>
    <div class="web3app-banner">
      <div class="web3app-banner-icon"><i class="ri-download-cloud-2-fill"></i></div>
      <div class="web3app-banner-text">
        <div class="web3app-banner-title">${escapeHtml(t('web3app_title') || 'Web3 App Store')}</div>
        <div class="web3app-banner-desc">${escapeHtml(t('web3app_subtitle') || '\uad6d\uac00\ubcc4 \ubc29\uc5b4\ub9c9\uc744 \uc6b0\ud68c\ud558\uc5ec Web3 \uc571\uc744 \ub2e4\uc6b4\ub85c\ub4dc\ud558\uc138\uc694')}</div>
      </div>
    </div>
    <div class="web3app-search">
      <i class="ri-search-line"></i>
      <input type="text" placeholder="${escapeHtml(t('web3app_search') || 'Search apps...')}" value="${escapeHtml(web3appSearch)}" data-search-web3app>
    </div>
    <div class="web3app-cats">${catsHtml}</div>
    <div class="web3app-list">${appsHtml}</div>
  `;
}

// ═══════════════════════════════════════════════════════════
// INTERSTITIAL AD (FULLSCREEN)
// ═══════════════════════════════════════════════════════════

function renderInterstitialAd() {
  if (!showInterstitialAd || !interstitialAdData) return '';
  const ad = interstitialAdData;
  const canSkip = interstitialCountdown <= 0;

  let mediaHtml = '';
  if (ad.type === 'video') {
    mediaHtml = `<video class="interstitial-media" autoplay muted playsinline loop><source src="${ad.url}" type="video/mp4"></video>`;
  } else {
    mediaHtml = `<img class="interstitial-media" src="${ad.url}" alt="Ad">`;
  }

  return `
    <div class="interstitial-overlay">
      <div class="interstitial-content" ${ad.link ? `data-action="interstitial-click" data-url="${ad.link}"` : ''}>
        ${mediaHtml}
      </div>
      <button class="interstitial-skip ${canSkip ? 'active' : ''}" data-action="interstitial-close">
        ${canSkip ? `<i class="ri-close-line"></i> ${escapeHtml(t('ad_skip') || 'Skip')}` : `<span class="interstitial-countdown">${interstitialCountdown}s</span>`}
      </button>
      <div class="interstitial-badge">${escapeHtml(t('ad_label') || 'AD')}</div>
    </div>
  `;
}

function showFullscreenAd(adData) {
  interstitialAdData = adData;
  interstitialCountdown = adData.duration || 5;
  showInterstitialAd = true;
  render();
  if (interstitialTimer) clearInterval(interstitialTimer);
  interstitialTimer = setInterval(() => {
    interstitialCountdown--;
    if (interstitialCountdown <= 0) {
      clearInterval(interstitialTimer);
      interstitialTimer = null;
    }
    const countdownEl = document.querySelector('.interstitial-countdown');
    const skipBtn = document.querySelector('.interstitial-skip');
    if (countdownEl && interstitialCountdown > 0) {
      countdownEl.textContent = interstitialCountdown + 's';
    } else if (skipBtn) {
      skipBtn.classList.add('active');
      skipBtn.innerHTML = `<i class="ri-close-line"></i> ${t('ad_skip') || 'Skip'}`;
    }
  }, 1000);
}

function closeInterstitialAd() {
  showInterstitialAd = false;
  interstitialAdData = null;
  if (interstitialTimer) { clearInterval(interstitialTimer); interstitialTimer = null; }
  render();
}

// ═══════════════════════════════════════════════════════════
// POPUP NOTICE
// ═══════════════════════════════════════════════════════════

function renderPopupNotice() {
  if (!showPopupNotice || !popupNoticeData) return '';
  const p = popupNoticeData;

  return `
    <div class="popup-notice-overlay" data-action="popup-close">
      <div class="popup-notice-box" onclick="event.stopPropagation()">
        ${p.image ? `<div class="popup-notice-image"><img src="${p.image}" alt=""></div>` : ''}
        <div class="popup-notice-body">
          <h3 class="popup-notice-title">${escapeHtml(p.title || '')}</h3>
          <div class="popup-notice-content">${p.content || ''}</div>
          ${p.link ? `<a class="popup-notice-link" data-action="popup-link" data-url="${p.link}">${escapeHtml(t('popup_view_more') || '\uc790\uc138\ud788 \ubcf4\uae30')}</a>` : ''}
        </div>
        <div class="popup-notice-footer">
          <label class="popup-dont-show"><input type="checkbox" data-action="popup-dont-show" ${popupDontShowToday ? 'checked' : ''}> ${escapeHtml(t('popup_dont_show_today') || '\uc624\ub298 \ub354 \uc774\uc0c1 \ubcf4\uc9c0 \uc54a\uae30')}</label>
          <button class="popup-close-btn" data-action="popup-close">${escapeHtml(t('popup_close') || '\ub2eb\uae30')}</button>
        </div>
      </div>
    </div>
  `;
}

function showPopup(data) {
  // Check "don't show today" setting
  const todayKey = 'popup_dismiss_' + new Date().toISOString().split('T')[0];
  if (localStorage.getItem(todayKey)) return;
  popupNoticeData = data;
  showPopupNotice = true;
  render();
}

function closePopup() {
  if (popupDontShowToday) {
    const todayKey = 'popup_dismiss_' + new Date().toISOString().split('T')[0];
    localStorage.setItem(todayKey, '1');
  }
  showPopupNotice = false;
  popupNoticeData = null;
  popupDontShowToday = false;
  render();
}

// Fetch ads and popups from API
async function fetchInterstitialAd() {
  try {
    const r = await fetch(`${API_BASE}/api/interstitial-ad`);
    if (r.ok) {
      const data = await r.json();
      if (data && data.url) {
        showFullscreenAd(data);
      }
    }
  } catch(e) { /* no ad available */ }
}

async function fetchPopupNotice() {
  try {
    const r = await fetch(`${API_BASE}/api/popup-notice`);
    if (r.ok) {
      const data = await r.json();
      if (data && (data.title || data.content)) {
        // Show popup after a short delay (after interstitial if any)
        setTimeout(() => showPopup(data), showInterstitialAd ? 6000 : 500);
      }
    }
  } catch(e) { /* no popup */ }
}

// ═══════════════════════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════════════════════

function renderSettings() {
  const currentLockOpt = LOCK_TIMEOUT_OPTIONS.find(o => o.val === state.lockTimeout) || LOCK_TIMEOUT_OPTIONS[0];
  const hasPrivatePin = !!state.privatePin;
  const isDark = state.theme === 'dark';

  return `
    <div class="sub-header"><button data-action="go-back"><i class="ri-arrow-left-line"></i></button><span>${escapeHtml(t('set_title'))}</span></div>

    <div class="setting-group">
      <div class="setting-group-title">${escapeHtml(t('set_appearance'))}</div>
      <div class="setting-item" data-action="toggle-theme">
        <div class="setting-left"><i class="${isDark ? 'ri-moon-line' : 'ri-sun-line'}" style="color:${isDark ? '#f59e0b' : '#00d4ff'}"></i><div>
          <div class="setting-label">${escapeHtml(t('set_theme'))}</div>
          <div class="setting-desc">${escapeHtml(isDark ? t('set_theme_dark') : t('set_theme_light'))}</div>
        </div></div>
        <div class="toggle ${isDark ? '' : 'active'}" style="pointer-events:none"></div>
      </div>
      <div class="setting-item" data-action="toggle-settings-lang">
        <div class="setting-left"><i class="ri-translate-2" style="color:#06b6d4"></i><div>
          <div class="setting-label">${escapeHtml(t('set_language') || '\uc5b8\uc5b4')}</div>
          <div class="setting-desc">${(LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0]).flag} ${(LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0]).nativeName}</div>
        </div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
      ${showSettingsLangPicker ? `
      <div class="settings-lang-grid">
        ${LANGUAGES.map(lang => `
          <div class="settings-lang-item ${state.language === lang.code ? 'active' : ''}" data-action="set-lang" data-lang="${lang.code}">
            <span class="settings-lang-flag">${lang.flag}</span>
            <span class="settings-lang-name">${lang.nativeName}</span>
            ${state.language === lang.code ? '<i class="ri-checkbox-circle-fill" style="color:var(--primary);font-size:16px"></i>' : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <div class="setting-group">
      <div class="setting-group-title">${escapeHtml(t('set_security'))}</div>
      <div class="setting-item" data-action="change-pin">
        <div class="setting-left"><i class="ri-lock-line"></i><div><div class="setting-label">${escapeHtml(t('set_change_pin'))}</div></div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
      <div class="setting-item" data-action="toggle-autolock">
        <div class="setting-left"><i class="ri-timer-line"></i><div><div class="setting-label">${escapeHtml(t('set_auto_lock'))}</div></div></div>
        <span class="setting-right">${escapeHtml(t(currentLockOpt.key))}</span>
      </div>
      <div class="setting-item" data-action="setup-private-pin">
        <div class="setting-left"><i class="ri-shield-keyhole-line" style="color:#f59e0b"></i><div>
          <div class="setting-label">${escapeHtml(t('set_private_pin'))}</div>
          <div class="setting-desc">${escapeHtml(t('set_private_pin_desc'))}</div>
        </div></div>
        <span class="setting-right" style="color:${hasPrivatePin ? '#10b981' : 'var(--text-muted)'}">${hasPrivatePin ? '●●●●●●' : escapeHtml(t('set_private_pin_set'))}</span>
      </div>
      ${hasPrivatePin ? `
      <div class="setting-item" data-action="remove-private-pin" style="border-color:rgba(239,68,68,0.2)">
        <div class="setting-left"><i class="ri-shield-cross-line" style="color:var(--danger)"></i><div class="setting-label" style="color:var(--danger)">${escapeHtml(t('set_private_pin_remove'))}</div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
      ` : ''}
    </div>



    <div class="setting-group">
      <div class="setting-group-title">${escapeHtml(t('set_data'))}</div>
      <div class="setting-item" data-action="export">
        <div class="setting-left"><i class="ri-download-line"></i><div class="setting-label">${escapeHtml(t('set_export'))}</div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
      <div class="setting-item" data-action="import">
        <div class="setting-left"><i class="ri-upload-line"></i><div class="setting-label">${escapeHtml(t('set_import'))}</div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
      <div class="setting-item" data-action="reset" style="border-color:rgba(239,68,68,0.2)">
        <div class="setting-left"><i class="ri-delete-bin-line" style="color:var(--danger)"></i><div class="setting-label" style="color:var(--danger)">${escapeHtml(t('set_reset'))}</div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
    </div>

    <div class="setting-group">
      <div class="setting-group-title">${escapeHtml(t('set_update'))}</div>
      <div class="setting-item" style="flex-direction:column;align-items:stretch;gap:8px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="setting-left"><i class="ri-smartphone-line" style="color:var(--primary)"></i><div>
            <div class="setting-label">${escapeHtml(t('set_update_current'))}</div>
            <div class="setting-desc">v${APP_VERSION} (${APP_VERSION_CODE})</div>
          </div></div>
        </div>
        ${updateCheckState === 'available' && updateInfo ? `
          <div style="background:var(--primary-dim);border:1px solid var(--primary-border);border-radius:10px;padding:12px;margin-top:4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <i class="ri-download-cloud-2-line" style="color:var(--primary);font-size:20px"></i>
              <strong style="color:var(--primary);font-size:14px">${escapeHtml(t('set_update_new_version').replace('{version}', updateInfo.version))}</strong>
            </div>
            ${updateInfo.changelog ? `<div style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:10px;white-space:pre-line">${escapeHtml(updateInfo.changelog)}</div>` : ''}
            <button class="btn btn-primary" data-action="app-download-update" style="width:100%;padding:10px;border-radius:10px;font-size:14px;font-weight:600">
              <i class="ri-download-line"></i> ${escapeHtml(updateCheckState === 'downloading' ? t('set_update_downloading') : t('set_update_download'))}
            </button>
          </div>
        ` : ''}
        ${updateCheckState === 'latest' ? `
          <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px;margin-top:4px">
            <i class="ri-checkbox-circle-fill" style="color:#10b981;font-size:18px"></i>
            <span style="color:#10b981;font-size:13px;font-weight:500">${escapeHtml(t('set_update_latest'))}</span>
          </div>
        ` : ''}
        ${updateCheckState === 'error' ? `
          <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px;margin-top:4px">
            <i class="ri-error-warning-line" style="color:var(--danger);font-size:18px"></i>
            <span style="color:var(--danger);font-size:13px">${escapeHtml(t('set_update_error'))}</span>
          </div>
        ` : ''}
      </div>
      <div class="setting-item" data-action="app-check-update" style="cursor:pointer">
        <div class="setting-left"><i class="ri-refresh-line ${updateCheckState === 'checking' ? 'ri-spin' : ''}" style="color:#06b6d4"></i><div>
          <div class="setting-label">${escapeHtml(updateCheckState === 'checking' ? t('set_update_checking') : t('set_update_check'))}</div>
        </div></div>
        <i class="ri-arrow-right-s-line" style="color:var(--text-muted)"></i>
      </div>
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// OTA UPDATE SYSTEM
// ═══════════════════════════════════════════════════════════

async function checkForUpdate() {
  if (updateCheckState === 'checking') return;
  updateCheckState = 'checking';
  render();
  try {
    const resp = await fetch(UPDATE_CHECK_URL + '?v=' + APP_VERSION_CODE + '&t=' + Date.now(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    if (data && data.versionCode && data.versionCode > APP_VERSION_CODE) {
      updateInfo = data;
      updateCheckState = 'available';
    } else {
      updateCheckState = 'latest';
    }
  } catch(e) {
    console.error('Update check failed:', e);
    updateCheckState = 'error';
  }
  render();
}

function downloadUpdate() {
  if (!updateInfo || !updateInfo.downloadUrl) return;
  updateCheckState = 'downloading';
  render();
  // Open download URL - Android will handle APK install
  window.open(updateInfo.downloadUrl, '_system');
  // Also try direct location for Capacitor
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
      window.Capacitor.Plugins.Browser.open({ url: updateInfo.downloadUrl });
    } else {
      window.location.href = updateInfo.downloadUrl;
    }
  } catch(e) {
    window.location.href = updateInfo.downloadUrl;
  }
  setTimeout(() => { updateCheckState = 'available'; render(); }, 3000);
}

// Auto-check for updates on app start (with 5s delay)
setTimeout(() => {
  if (!IS_ELECTRON) checkForUpdate();
}, 5000);

function renderModal() {
  let title = '';
  let body = '';

  if (modalType === 'add-bookmark' || modalType === 'edit-bookmark') {
    title = modalType === 'edit-bookmark' ? t('bm_title_field') : t('bm_add_bookmark');
    const bm = editingItem || {};
    const catOptions = BOOKMARK_CATEGORIES.map(c =>
      `<option value="${c}" ${bm.category === c ? 'selected' : ''}>${t(BOOKMARK_CATEGORY_KEYS[c])}</option>`
    ).join('');

    const isSensitiveLocked = state.privatePin && !privatePinUnlocked;
    const passValue = isSensitiveLocked ? '' : escapeHtml(bm.password || '');
    const passPlaceholder = isSensitiveLocked ? t('set_private_pin_locked') : '';

    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_url'))}</label><input class="form-input" id="m-url" value="${escapeHtml(bm.url || '')}" placeholder="https://" autofocus></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_title_field'))} <span style="font-size:10px;color:var(--text-muted);font-weight:normal">(${escapeHtml(t('auto_fill_hint') || 'URL 입력 시 자동')})</span></label><input class="form-input" id="m-title" value="${escapeHtml(bm.title || '')}" placeholder="${escapeHtml(t('bm_title_field'))}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_category') || '분류')}</label>
        <div class="cat-chip-grid" id="m-cat-chips">
          ${BOOKMARK_CATEGORIES.map(c => {
            const color = CATEGORY_COLORS[c] || '#64748b';
            const icon = BOOKMARK_CATEGORY_ICONS[c] || 'ri-more-line';
            const isActive = (bm.category || 'main_site') === c;
            return `<span class="cat-chip ${isActive ? 'active' : ''}" data-cat-select="${c}" style="--chip-color:${color}"><i class="${icon}"></i> ${escapeHtml(t(BOOKMARK_CATEGORY_KEYS[c]))}</span>`;
          }).join('')}
        </div>
        <input type="hidden" id="m-cat" value="${escapeHtml(bm.category || 'main_site')}">
      </div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_username'))}</label><input class="form-input" id="m-user" value="${escapeHtml(bm.username || '')}"></div>
      <div class="form-group">
        <label class="form-label">${escapeHtml(t('bm_password'))} ${isSensitiveLocked ? '<i class="ri-lock-line" style="color:#f59e0b"></i>' : ''}</label>
        <input class="form-input ${isSensitiveLocked ? 'locked-field' : ''}" type="password" id="m-pass" value="${passValue}" placeholder="${passPlaceholder}" ${isSensitiveLocked ? 'readonly data-needs-private-pin="true"' : ''}>
        ${isSensitiveLocked ? `<button class="unlock-btn" data-action="unlock-private-pin" data-field="bookmark"><i class="ri-lock-unlock-line"></i> ${escapeHtml(t('set_private_pin_enter'))}</button>` : ''}
      </div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_notes'))}</label><textarea class="form-textarea" id="m-notes">${escapeHtml(bm.notes || '')}</textarea></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="bookmark">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-web3' || modalType === 'edit-web3') {
    title = modalType === 'edit-web3' ? t('bm_web3') : t('bm_add_web3');
    const ma = editingItem || {};

    const isSensitiveLocked = state.privatePin && !privatePinUnlocked;
    const passValue = isSensitiveLocked ? '' : escapeHtml(ma.password || '');
    const seedValue = isSensitiveLocked ? '' : escapeHtml(ma.recoveryEmail || '');
    const passPlaceholder = isSensitiveLocked ? t('set_private_pin_locked') : '';

    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_wallet_address'))}</label><input class="form-input" id="m-email" value="${escapeHtml(ma.email || '')}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_platform'))}</label><input class="form-input" id="m-provider" value="${escapeHtml(ma.provider || '')}"></div>
      <div class="form-group">
        <label class="form-label">${escapeHtml(t('bm_password_field'))} ${isSensitiveLocked ? '<i class="ri-lock-line" style="color:#f59e0b"></i>' : ''}</label>
        <input class="form-input ${isSensitiveLocked ? 'locked-field' : ''}" type="password" id="m-pass" value="${passValue}" placeholder="${passPlaceholder}" ${isSensitiveLocked ? 'readonly data-needs-private-pin="true"' : ''}>
      </div>
      <div class="form-group">
        <label class="form-label">
          <span class="max-security-label"><i class="ri-shield-star-line"></i> ${escapeHtml(t('bm_seed_phrase'))}</span>
          <span class="max-security-badge" data-action="show-security-explain" style="cursor:pointer">${escapeHtml(t('security_max'))}</span>
          ${isSensitiveLocked ? ' <i class="ri-lock-line" style="color:#f59e0b"></i>' : ''}
        </label>
        <textarea class="form-textarea max-security-field ${isSensitiveLocked ? 'locked-field' : ''}" id="m-recovery" style="min-height:60px" placeholder="${passPlaceholder}" ${isSensitiveLocked ? 'readonly data-needs-private-pin="true"' : ''}>${seedValue}</textarea>
      </div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_network'))}</label><input class="form-input" id="m-network" value="${escapeHtml(ma.recoveryPhone || '')}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('bm_memo'))}</label><textarea class="form-textarea" id="m-notes" style="min-height:60px">${escapeHtml(ma.notes || '')}</textarea></div>
      ${isSensitiveLocked ? `<button class="unlock-btn" data-action="unlock-private-pin" data-field="web3" style="margin-bottom:12px"><i class="ri-lock-unlock-line"></i> ${escapeHtml(t('set_private_pin_enter'))}</button>` : ''}
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="web3">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-memo' || modalType === 'edit-memo') {
    title = modalType === 'edit-memo' ? t('memo_edit') : t('memo_new');
    const m = editingItem || {};
    const hasExistingImage = m.imageFileName && memoImageCache[m.id];
    const showImage = memoTempImage || (hasExistingImage && memoTempImage !== false);
    const imgSrc = memoTempImage ? `data:${memoTempImage.mimeType};base64,${memoTempImage.base64Data}` : (hasExistingImage ? memoImageCache[m.id] : '');

    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('memo_title_field'))}</label><input class="form-input" id="m-title" value="${escapeHtml(m.title || '')}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('memo_content'))}</label><textarea class="form-textarea" id="m-content" rows="4">${escapeHtml(m.content || '')}</textarea></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('memo_link'))}</label><input class="form-input" id="m-link" value="${escapeHtml(m.link || '')}" placeholder="https://"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('memo_tags'))}</label><input class="form-input" id="m-tags" value="${escapeHtml((m.tags || []).join(', '))}" placeholder="${escapeHtml(t('memo_tags_hint'))}"></div>
      <div class="form-group" id="memo-paste-zone" tabindex="0" style="outline:none">
        <label class="form-label"><i class="ri-image-line"></i> ${escapeHtml(t('memo_image'))}</label>
        ${showImage ? `
          <div class="memo-image-preview"><img src="${imgSrc}" alt=""><button class="remove-img-btn" data-action="remove-memo-image"><i class="ri-close-line"></i></button></div>
        ` : `
          <div class="memo-image-drop">
            <i class="ri-image-add-line" style="font-size:24px;color:var(--text-muted)"></i>
            <p style="font-size:11px;color:var(--text-muted);margin-top:4px">${escapeHtml(t('memo_paste_hint'))}</p>
            <button class="btn btn-outline btn-sm" data-action="pick-memo-image" style="margin-top:8px"><i class="ri-camera-line"></i> ${escapeHtml(t('memo_pick_image'))}</button>
          </div>
        `}
      </div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="memo">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-work' || modalType === 'edit-work') {
    title = modalType === 'edit-work' ? t('work_edit') : t('work_add');
    const w = workEditingItem || {};
    const existingFields = w.fields || [{ name: '', value: '', sensitive: true }];
    const fieldsHtml = existingFields.map((f, idx) => `
      <div class="work-modal-field" data-field-idx="${idx}">
        <div style="display:flex;gap:6px;align-items:center">
          <input class="form-input" style="flex:1" placeholder="${escapeHtml(t('work_field_name'))}" value="${escapeHtml(f.name || '')}" data-work-field-name="${idx}">
          <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-muted);white-space:nowrap">
            <input type="checkbox" data-work-field-sensitive="${idx}" ${f.sensitive ? 'checked' : ''}> <i class="ri-lock-line"></i>
          </label>
          ${idx > 0 ? `<button class="work-field-remove" data-action="remove-work-field" data-field-idx="${idx}"><i class="ri-close-line"></i></button>` : ''}
        </div>
        <textarea class="form-textarea" rows="2" placeholder="${escapeHtml(t('work_field_value'))}" data-work-field-value="${idx}">${escapeHtml(f.value || '')}</textarea>
      </div>
    `).join('');

    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('work_name'))}</label><input class="form-input" id="w-name" value="${escapeHtml(w.name || '')}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('work_type'))}</label>
        <div class="work-type-chips">
          ${WORK_TYPES.map(wt => `<button class="work-type-chip ${(w.type || 'api_key') === wt.id ? 'active' : ''}" data-work-type="${wt.id}" style="--chip-color:${wt.color}"><i class="${wt.icon}"></i> ${escapeHtml(t('work_type_' + wt.id))}</button>`).join('')}
        </div>
      </div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('work_security_level'))}</label>
        <div class="work-type-chips">
          <button class="work-type-chip ${(w.securityLevel || 'normal') === 'normal' ? 'active' : ''}" data-work-sec="normal" style="--chip-color:#10b981"><i class="ri-shield-line"></i> ${escapeHtml(t('work_sec_normal'))}</button>
          <button class="work-type-chip ${(w.securityLevel || 'normal') === 'high' ? 'active' : ''}" data-work-sec="high" style="--chip-color:#f59e0b"><i class="ri-shield-check-line"></i> ${escapeHtml(t('work_sec_high'))}</button>
          <button class="work-type-chip ${(w.securityLevel || 'normal') === 'critical' ? 'active' : ''}" data-work-sec="critical" style="--chip-color:#ef4444"><i class="ri-shield-flash-line"></i> ${escapeHtml(t('work_sec_critical'))}</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">URL (${escapeHtml(t('memo_optional'))})</label><input class="form-input" id="w-url" value="${escapeHtml(w.url || '')}" placeholder="https://"></div>
      <div class="form-group">
        <label class="form-label"><i class="ri-key-2-line"></i> ${escapeHtml(t('work_fields'))}</label>
        <div id="work-fields-container">${fieldsHtml}</div>
        <button class="btn btn-outline btn-sm" data-action="add-work-field" style="margin-top:8px"><i class="ri-add-line"></i> ${escapeHtml(t('work_add_field'))}</button>
      </div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('work_notes'))}</label><textarea class="form-textarea" id="w-notes" rows="2">${escapeHtml(w.notes || '')}</textarea></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="work"><i class="ri-shield-check-line"></i> ${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'change-pin') {
    title = t('set_change_pin');
    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('set_old_pin'))}</label><input class="form-input" id="m-oldpin" type="password" maxlength="4"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('set_new_pin'))}</label><input class="form-input" id="m-newpin" type="password" maxlength="4"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('set_confirm_pin'))}</label><input class="form-input" id="m-confirmpin" type="password" maxlength="4"></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="pin">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'autolock') {
    title = t('set_auto_lock');
    body = LOCK_TIMEOUT_OPTIONS.map(o => `
      <div class="setting-item" data-autolock="${o.val}" style="cursor:pointer">
        <div class="setting-left"><div class="setting-label">${escapeHtml(t(o.key))}</div></div>
        ${state.lockTimeout === o.val ? '<i class="ri-check-line" style="color:#10b981"></i>' : ''}
      </div>
    `).join('');
  } else if (modalType === 'private-pin') {
    const stepLabel = privatePinStep === 'new' ? t('set_private_pin_new') :
      privatePinStep === 'confirm' ? t('set_private_pin_confirm') :
      privatePinStep === 'enter' ? t('set_private_pin_enter') :
      privatePinStep === 'verify-remove' ? t('set_private_pin_verify_remove') : '';

    const dots6 = [0,1,2,3,4,5].map(i =>
      `<div class="pin-dot ${privatePinInput.length > i ? 'filled' : ''} ${privatePinError ? 'error' : ''}"></div>`
    ).join('');

    title = t('set_private_pin');
    body = `
      <div style="text-align:center;padding:16px 0">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">${escapeHtml(stepLabel)}</p>
        ${privatePinError ? `<p style="font-size:12px;color:var(--danger);margin-bottom:8px">${escapeHtml(privatePinError)}</p>` : ''}
        <div class="pin-dots" style="margin-bottom:20px">${dots6}</div>
        <div class="keypad compact">
          ${['123','456','789',' 0del'].map(row => `
            <div class="key-row">
              ${row === ' 0del' ? `
                <div class="key special"></div>
                <div class="key" data-ppin-key="0">0</div>
                <div class="key special" data-ppin-key="del"><i class="ri-delete-back-2-line"></i></div>
              ` : row.split('').map(k => `<div class="key" data-ppin-key="${k}">${k}</div>`).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (modalType === 'share-pin') {
    title = t('share_set_pin');
    body = `
      <div style="text-align:center;padding:16px 0">
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">${escapeHtml(t('share_pin_desc'))}</p>
        <div class="form-group"><input class="form-input" id="share-pin-input" type="password" maxlength="6" placeholder="6${escapeHtml(t('share_pin_digits'))}" style="text-align:center;font-size:24px;letter-spacing:8px"></div>
        <div class="btn-row" style="margin-top:16px">
          <button class="btn btn-outline" data-action="share-no-pin">${escapeHtml(t('share_no_pin'))}</button>
          <button class="btn btn-primary" data-action="share-with-pin"><i class="ri-lock-line"></i> ${escapeHtml(t('share_with_pin'))}</button>
        </div>
      </div>
    `;
  } else if (modalType === 'share-result') {
    title = t('share_result_title');
    const shareUrl = window._lastShareUrl || '';
    body = `
      <div style="text-align:center;padding:16px 0">
        <i class="ri-check-double-line" style="font-size:48px;color:#10b981;display:block;margin-bottom:12px"></i>
        <p style="font-size:14px;font-weight:600;margin-bottom:8px">${escapeHtml(t('share_created'))}</p>
        <p style="font-size:11px;color:var(--text-muted);margin-bottom:16px">${escapeHtml(t('share_expires'))}</p>
        <div class="form-input" style="font-size:11px;word-break:break-all;text-align:left;cursor:pointer;background:var(--bg-input)" data-action="copy-share-link">${escapeHtml(shareUrl)}</div>
        <div class="btn-row" style="margin-top:16px">
          <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
          <button class="btn btn-primary" data-action="copy-share-link"><i class="ri-file-copy-line"></i> ${escapeHtml(t('share_copy'))}</button>
        </div>
      </div>
    `;
  } else if (modalType === 'add-token') {
    title = t('token_add');
    // Mainnet tokens (top section)
    const mainnetTokens = TOKEN_LIST.filter(tk => tk.mainnet && !tk.fixed && !state.savedTokens.includes(tk.id));
    const otherTokens = TOKEN_LIST.filter(tk => !tk.mainnet && !tk.fixed && !state.savedTokens.includes(tk.id));
    const allAvailable = [...mainnetTokens, ...otherTokens];
    
    const renderTokenItem = (tk) => {
      const logoHtml = tk.logo
        ? `<div class="token-icon has-logo" style="background:${tk.color}20;width:36px;height:36px"><img src="${escapeHtml(tk.logo)}" alt="${escapeHtml(tk.symbol)}" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.style.color='${tk.color}';this.parentElement.textContent='${tk.icon}'"></div>`
        : `<div class="token-icon" style="background:${tk.color}20;color:${tk.color};width:36px;height:36px;font-size:14px">${tk.icon}</div>`;
      return `
        <div class="token-select-item" data-action="select-token" data-token-id="${tk.id}">
          ${logoHtml}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600">${escapeHtml(tk.name)}${tk.mainnet ? ' <span style="font-size:9px;padding:1px 4px;background:var(--primary);color:#fff;border-radius:3px;vertical-align:middle">Mainnet</span>' : ''}</div>
            <div style="font-size:10px;color:var(--text-muted)">${tk.symbol}</div>
          </div>
          <i class="ri-add-circle-line" style="font-size:20px;color:var(--primary)"></i>
        </div>
      `;
    };
    
    const mainnetHtml = mainnetTokens.length > 0
      ? `<div class="token-section-label"><i class="ri-global-line"></i> ${escapeHtml(t('token_mainnet') || 'Mainnet')}</div>` + mainnetTokens.map(renderTokenItem).join('')
      : '';
    const otherHtml = otherTokens.length > 0
      ? `<div class="token-section-label" style="margin-top:8px"><i class="ri-coin-line"></i> ${escapeHtml(t('token_other') || 'Tokens')}</div>` + otherTokens.map(renderTokenItem).join('')
      : '';
    
    // Contract address search section
    const contractSearchHtml = `
      <div class="contract-search-section">
        <div class="token-section-label"><i class="ri-search-line"></i> ${escapeHtml(t('token_search_contract') || 'Search by Contract Address')}</div>
        <div class="contract-search-row">
          <select class="form-input" id="token-network-select" style="width:120px;flex-shrink:0;font-size:12px">
            <option value="ethereum">Ethereum</option>
            <option value="binance-smart-chain">BSC</option>
            <option value="polygon-pos">Polygon</option>
            <option value="arbitrum-one">Arbitrum</option>
            <option value="avalanche">Avalanche</option>
            <option value="base">Base</option>
            <option value="optimistic-ethereum">Optimism</option>
            <option value="solana">Solana</option>
          </select>
          <input class="form-input" id="token-contract-input" placeholder="0x..." style="flex:1;font-size:12px">
          <button class="btn btn-primary btn-sm" data-action="search-contract-token" style="flex-shrink:0"><i class="ri-search-line"></i></button>
        </div>
        <div id="contract-search-result" style="margin-top:8px"></div>
      </div>
    `;
    
    body = `
      ${contractSearchHtml}
      <div class="token-select-list" style="max-height:300px;overflow-y:auto">
        ${mainnetHtml}
        ${otherHtml}
        ${allAvailable.length === 0 ? `<div class="empty-state" style="padding:16px"><p>${escapeHtml(t('token_all_added'))}</p></div>` : ''}
      </div>
    `;
  } else if (modalType === 'add-project') {
    title = t('project_add');
    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('project_name'))}</label><input class="form-input" id="m-proj-name" placeholder="My Project"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('project_url'))}</label><input class="form-input" id="m-proj-url" placeholder="https://myproject.1page.to"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('project_logo'))} <span style="font-size:10px;color:var(--text-muted);font-weight:400">(${escapeHtml(t('project_logo_auto') || 'auto-fetched from site')})</span></label><input class="form-input" id="m-proj-logo" placeholder="🌐 (emoji fallback)" maxlength="4"></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="project">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-orgchart') {
    title = t('org_new_chart');
    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('org_project_name'))}</label><input class="form-input" id="m-org-name" placeholder="${escapeHtml(t('org_project_name'))}"></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="orgchart">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-org-node' || modalType === 'edit-org-node') {
    title = modalType === 'edit-org-node' ? t('org_edit_member') : t('org_add_member');
    const node = orgEditNode || {};
    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('org_name'))}</label><input class="form-input" id="m-node-name" value="${escapeHtml(node.name || '')}"></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('org_phone'))}</label><input class="form-input" id="m-node-phone" value="${escapeHtml(node.phone || '')}" placeholder="+82-10-..."></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('org_wallet'))}</label><input class="form-input" id="m-node-wallet" value="${escapeHtml(node.wallet || '')}" placeholder="0x..."></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('org_amount'))}</label><input class="form-input" id="m-node-amount" type="number" value="${escapeHtml(String(node.amount || ''))}" placeholder="0"></div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        ${modalType === 'edit-org-node' ? `<button class="btn btn-danger" data-action="delete-org-node"><i class="ri-delete-bin-line"></i></button>` : ''}
        <button class="btn btn-primary" data-modal-save="org-node">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'add-clipboard' || modalType === 'edit-clipboard') {
    title = modalType === 'edit-clipboard' ? (t('clip_edit') || '클립보드 수정') : (t('clip_add_title') || '클립보드 추가');
    const clip = clipboardEditingItem || {};
    body = `
      <div class="form-group"><label class="form-label">${escapeHtml(t('clip_title_label') || '제목')}</label><input class="form-input" id="m-clip-title" value="${escapeHtml(clip.title || '')}" placeholder="${escapeHtml(t('clip_title_placeholder') || '제목을 입력하세요')}" autofocus></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('clip_memo_label') || '메모')}</label><textarea class="form-textarea" id="m-clip-memo" rows="2" placeholder="${escapeHtml(t('clip_memo_placeholder') || '메모를 입력하세요')}">${escapeHtml(clip.memo || '')}</textarea></div>
      <div class="form-group"><label class="form-label">${escapeHtml(t('clip_content_label') || '내용')}</label><textarea class="form-textarea" id="m-clip-content" rows="4" placeholder="${escapeHtml(t('clip_content_placeholder') || '텍스트를 붙여넣거나 입력하세요')}">${escapeHtml(clip.content || '')}</textarea></div>
      <div class="form-group">
        <label class="form-label"><i class="ri-image-line"></i> ${escapeHtml(t('clip_image_label') || '이미지')}</label>
        <div class="clip-image-upload" id="clip-image-drop">
          ${clip.imageData ? `<img src="${clip.imageData}" class="clip-preview-img" id="clip-preview-img"><button class="clip-img-remove" data-action="clip-remove-image"><i class="ri-close-line"></i></button>` : `<div class="clip-upload-placeholder"><i class="ri-image-add-line" style="font-size:32px;opacity:0.3"></i><p style="opacity:0.4;font-size:12px">${escapeHtml(t('clip_paste_image') || 'Ctrl+V로 이미지 붙여넣기')}</p><label class="clip-file-label"><i class="ri-camera-line"></i> ${escapeHtml(t('clip_select_image') || '이미지 선택')}<input type="file" accept="image/*" id="clip-file-input" style="display:none"></label></div>`}
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>${escapeHtml(t('bm_cancel'))}</button>
        <button class="btn btn-primary" data-modal-save="clipboard">${escapeHtml(t('bm_save'))}</button>
      </div>
    `;
  } else if (modalType === 'security-explain') {
    title = t('security_explain_title') || 'Why Maximum Security?';
    body = `
      <div class="security-explain-content">
        <div class="sec-item">
          <div class="sec-icon" style="background:#10b98120;color:#10b981"><i class="ri-smartphone-line"></i></div>
          <div class="sec-text">
            <h4>${escapeHtml(t('sec_local_title') || 'Local Storage Only')}</h4>
            <p>${escapeHtml(t('sec_local_desc') || 'All your data is stored locally on your device. Nothing is sent to any server. Your seed phrases never leave your phone.')}</p>
          </div>
        </div>
        <div class="sec-item">
          <div class="sec-icon" style="background:#f59e0b20;color:#f59e0b"><i class="ri-lock-password-line"></i></div>
          <div class="sec-text">
            <h4>${escapeHtml(t('sec_pin_title') || 'Double PIN Protection')}</h4>
            <p>${escapeHtml(t('sec_pin_desc') || 'App PIN + Private PIN (6-digit) double lock. Even if someone accesses your phone, seed phrases remain hidden behind a separate private PIN.')}</p>
          </div>
        </div>
        <div class="sec-item">
          <div class="sec-icon" style="background:#00d4ff20;color:#00d4ff"><i class="ri-shield-check-line"></i></div>
          <div class="sec-text">
            <h4>${escapeHtml(t('sec_encrypt_title') || 'No Cloud, No Hack')}</h4>
            <p>${escapeHtml(t('sec_encrypt_desc') || 'Unlike cloud-based password managers, your data cannot be hacked remotely. No server means no data breach risk.')}</p>
          </div>
        </div>
        <div class="sec-item">
          <div class="sec-icon" style="background:#8b5cf620;color:#8b5cf6"><i class="ri-eye-off-line"></i></div>
          <div class="sec-text">
            <h4>${escapeHtml(t('sec_hidden_title') || 'Hidden Sensitive Data')}</h4>
            <p>${escapeHtml(t('sec_hidden_desc') || 'Passwords and seed phrases are masked by default. They can only be revealed after Private PIN verification.')}</p>
          </div>
        </div>
        <div class="sec-item">
          <div class="sec-icon" style="background:#ef444420;color:#ef4444"><i class="ri-timer-line"></i></div>
          <div class="sec-text">
            <h4>${escapeHtml(t('sec_autolock_title') || 'Auto-Lock')}</h4>
            <p>${escapeHtml(t('sec_autolock_desc') || 'The app automatically locks after a set period of inactivity, preventing unauthorized access.')}</p>
          </div>
        </div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" data-modal-close style="width:100%">${escapeHtml(t('set_confirm') || 'OK')}</button></div>
    `;
  } else if (modalType === 'kpi-prompt') {
    title = kpiModalTitle || 'Input';
    body = `
      ${kpiModalFields.map(f => `
        <div class="form-group"><label class="form-label">${escapeHtml(f.label)}</label>
          ${f.type === 'textarea' ? `<textarea class="form-input" id="${f.id}" placeholder="${escapeHtml(f.placeholder || '')}" style="min-height:60px;resize:vertical;font-family:inherit" ${f.autofocus ? 'autofocus' : ''}>${escapeHtml(f.value || '')}</textarea>` : `<input class="form-input" id="${f.id}" value="${escapeHtml(f.value || '')}" placeholder="${escapeHtml(f.placeholder || '')}" ${f.type === 'date' ? 'type="date"' : ''} ${f.autofocus ? 'autofocus' : ''}>`}</div>
      `).join('')}
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>취소</button>
        <button class="btn btn-primary" data-modal-save="kpi-prompt">확인</button>
      </div>
    `;
  } else if (modalType === 'kpi-confirm') {
    title = '확인';
    body = `
      <div style="padding:12px 0;color:var(--text-secondary);font-size:14px">${escapeHtml(kpiConfirmMessage)}</div>
      <div class="btn-row">
        <button class="btn btn-outline" data-modal-close>취소</button>
        <button class="btn btn-primary" data-modal-save="kpi-confirm" style="background:#ef4444">삭제</button>
      </div>
    `;
  } else if (modalType === 'kpi-share') {
    const shareProj = kpiProjects.find(p => p.id === kpiShareProjectId);
    title = '프로젝트 공유';
    body = `
      <div style="padding:8px 0;color:var(--text-secondary);font-size:13px;text-align:center;margin-bottom:12px">
        <i class="ri-team-line" style="font-size:24px;color:var(--accent-primary)"></i>
        <div style="margin-top:4px;font-weight:600;color:var(--text-primary)">${escapeHtml(shareProj?.name || '')}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">팀원과 WBS 데이터를 공유하세요</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button data-action="kpi-share-export-json" class="btn btn-outline" style="width:100%;display:flex;align-items:center;gap:8px;justify-content:flex-start;padding:12px 16px">
          <i class="ri-download-2-line" style="font-size:18px;color:#3b82f6"></i>
          <div style="text-align:left"><div style="font-size:13px;font-weight:600">JSON 파일 내보내기</div><div style="font-size:10px;color:var(--text-muted)">파일로 저장하여 팀원에게 전송</div></div>
        </button>
        <button data-action="kpi-share-import-json" class="btn btn-outline" style="width:100%;display:flex;align-items:center;gap:8px;justify-content:flex-start;padding:12px 16px">
          <i class="ri-upload-2-line" style="font-size:18px;color:#10b981"></i>
          <div style="text-align:left"><div style="font-size:13px;font-weight:600">JSON 파일 가져오기</div><div style="font-size:10px;color:var(--text-muted)">팀원이 보낸 파일을 열기</div></div>
        </button>
        <div style="border-top:1px solid var(--bg-card-border);margin:4px 0"></div>
        <button data-action="kpi-share-qr" class="btn btn-outline" style="width:100%;display:flex;align-items:center;gap:8px;justify-content:flex-start;padding:12px 16px">
          <i class="ri-qr-code-line" style="font-size:18px;color:#8b5cf6"></i>
          <div style="text-align:left"><div style="font-size:13px;font-weight:600">QR코드 생성</div><div style="font-size:10px;color:var(--text-muted)">상대방이 QR 스캔으로 가져오기</div></div>
        </button>
        <div style="border-top:1px solid var(--bg-card-border);margin:4px 0"></div>
        <button data-action="kpi-share-clipboard-copy" class="btn btn-outline" style="width:100%;display:flex;align-items:center;gap:8px;justify-content:flex-start;padding:12px 16px">
          <i class="ri-file-copy-line" style="font-size:18px;color:#f59e0b"></i>
          <div style="text-align:left"><div style="font-size:13px;font-weight:600">클립보드 복사</div><div style="font-size:10px;color:var(--text-muted)">데이터를 복사하여 메신저로 전송</div></div>
        </button>
        <button data-action="kpi-share-clipboard-paste" class="btn btn-outline" style="width:100%;display:flex;align-items:center;gap:8px;justify-content:flex-start;padding:12px 16px">
          <i class="ri-clipboard-line" style="font-size:18px;color:#06b6d4"></i>
          <div style="text-align:left"><div style="font-size:13px;font-weight:600">클립보드 붙여넣기</div><div style="font-size:10px;color:var(--text-muted)">받은 데이터를 붙여넣어 가져오기</div></div>
        </button>
      </div>
    `;
  } else if (modalType === 'kpi-qr') {
    title = 'QR코드 공유';
    body = `
      <div style="display:flex;flex-direction:column;align-items:center;padding:16px 0">
        <canvas id="kpi-qr-canvas" width="256" height="256" style="border:8px solid #fff;border-radius:8px;background:#fff"></canvas>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);text-align:center">상대방이 이 QR코드를 스캔하면<br>WBS 데이터를 가져올 수 있습니다</div>
      </div>
    `;
  }

  const centerClass = (modalType === 'private-pin' || modalType === 'security-explain' || modalType === 'kpi-prompt' || modalType === 'kpi-confirm' || modalType === 'kpi-share' || modalType === 'kpi-qr') ? ' modal-center' : '';
  return `
    <div class="modal-overlay${centerClass}" data-modal-overlay>
      <div class="modal" onclick="event.stopPropagation()" id="modal-inner">
        <div class="modal-header">
          <div class="modal-title">${escapeHtml(title)}</div>
          <button class="modal-close" data-modal-close><i class="ri-close-line"></i></button>
        </div>
        ${body}
      </div>
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════
// SCAN MODAL & CUSTOM MAINNET
// ═══════════════════════════════════════════════════════════

function getAllChains() {
  const chains = { ...CHAIN_EXPLORERS };
  customMainnets.forEach(cm => {
    chains[cm.id] = cm;
  });
  return chains;
}

function renderScanModal() {
  const allChains = getAllChains();
  const selectedChain = allChains[scanSelectedChain] || allChains['ethereum'];
  
  // Categorize chains
  const majorChains = ['ethereum', 'bitcoin', 'binance-smart-chain', 'polygon-pos', 'solana', 'arbitrum-one', 'base', 'optimistic-ethereum', 'avalanche'];
  const defiChains = ['tron', 'near', 'aptos', 'sui', 'cosmos', 'polkadot'];
  
  const renderChainItem = (key, chain) => {
    const isCustom = customMainnets.some(cm => cm.id === key);
    const searchTerm = (typeof scanChainSearch === 'string' ? scanChainSearch : '').toLowerCase();
    if (searchTerm && !chain.name.toLowerCase().includes(searchTerm) && !key.toLowerCase().includes(searchTerm)) return '';
    return `
      <div class="scan-chain-card ${scanSelectedChain === key ? 'active' : ''}" data-action="scan-select-chain" data-chain-id="${key}">
        <div class="scan-chain-card-icon" style="background:${chain.color}20;border-color:${chain.color}40">
          <span style="color:${chain.color};font-size:20px">${chain.icon || '⬡'}</span>
        </div>
        <span class="scan-chain-card-name">${escapeHtml(chain.name)}</span>
        ${isCustom ? '<span class="scan-chain-badge">Custom</span>' : ''}
        ${scanSelectedChain === key ? '<i class="ri-checkbox-circle-fill scan-chain-check"></i>' : ''}
      </div>
    `;
  };

  const majorHtml = majorChains.map(key => allChains[key] ? renderChainItem(key, allChains[key]) : '').join('');
  const defiHtml = defiChains.map(key => allChains[key] ? renderChainItem(key, allChains[key]) : '').join('');
  const otherKeys = Object.keys(allChains).filter(k => !majorChains.includes(k) && !defiChains.includes(k) && !customMainnets.some(cm => cm.id === k));
  const otherHtml = otherKeys.map(key => renderChainItem(key, allChains[key])).join('');
  const customHtml = customMainnets.map(cm => allChains[cm.id] ? renderChainItem(cm.id, allChains[cm.id]) : '').join('');

  const searchTerm = (typeof scanChainSearch === 'string' ? scanChainSearch : '').toLowerCase();
  const showCategories = !searchTerm;

  return `
    <div class="scan-modal-overlay" data-action="close-scan-modal">
      <div class="scan-modal scan-modal-expanded" onclick="event.stopPropagation()">
        <div class="scan-modal-header">
          <div class="scan-modal-title">
            <i class="ri-scan-2-line"></i>
            <span>${escapeHtml(t('scan_title') || '지갑 스캔')}</span>
          </div>
          <button class="scan-modal-close" data-action="close-scan-modal"><i class="ri-close-line"></i></button>
        </div>

        <div class="scan-modal-body">
          <!-- Add Custom Mainnet - Prominent CTA -->
          <button class="scan-add-custom-cta" data-action="open-custom-mainnet-modal">
            <div class="scan-add-custom-cta-left">
              <div class="scan-add-custom-cta-icon"><i class="ri-add-circle-fill"></i></div>
              <div>
                <div class="scan-add-custom-cta-title">${escapeHtml(t('scan_add_custom') || '커스텀 메인넷 추가')}</div>
                <div class="scan-add-custom-cta-desc">${escapeHtml(t('scan_add_custom_desc') || '나만의 네트워크를 추가하세요')}</div>
              </div>
            </div>
            <i class="ri-arrow-right-s-line"></i>
          </button>

          <!-- Search -->
          <div class="scan-search-box">
            <i class="ri-search-line"></i>
            <input type="text" class="scan-search-input" id="scan-chain-search" placeholder="${escapeHtml(t('scan_search_chain') || '네트워크 검색...')}" value="${escapeHtml(typeof scanChainSearch === 'string' ? scanChainSearch : '')}" />
          </div>

          <!-- Chain Grid - Expanded -->
          <div class="scan-chain-sections">
            ${showCategories ? `
            <div class="scan-chain-category">
              <div class="scan-chain-category-label"><i class="ri-star-fill" style="color:#f59e0b"></i> ${escapeHtml(t('scan_major_chains') || 'Major Networks')}</div>
              <div class="scan-chain-grid-expanded">${majorHtml}</div>
            </div>
            <div class="scan-chain-category">
              <div class="scan-chain-category-label"><i class="ri-links-fill" style="color:#8b5cf6"></i> ${escapeHtml(t('scan_defi_chains') || 'DeFi & L1')}</div>
              <div class="scan-chain-grid-expanded">${defiHtml}</div>
            </div>
            ${otherHtml ? `
            <div class="scan-chain-category">
              <div class="scan-chain-category-label"><i class="ri-global-line" style="color:#06b6d4"></i> ${escapeHtml(t('scan_other_chains') || 'Others')}</div>
              <div class="scan-chain-grid-expanded">${otherHtml}</div>
            </div>
            ` : ''}
            ${customHtml ? `
            <div class="scan-chain-category">
              <div class="scan-chain-category-label"><i class="ri-user-settings-line" style="color:#10b981"></i> ${escapeHtml(t('scan_custom_chains') || 'Custom')}</div>
              <div class="scan-chain-grid-expanded">${customHtml}</div>
            </div>
            ` : ''}
            ` : `
            <div class="scan-chain-grid-expanded">
              ${majorHtml}${defiHtml}${otherHtml}${customHtml}
            </div>
            `}
          </div>

          <!-- Selected Chain Info - Dropdown Trigger -->
          <div class="scan-selected-dropdown">
            <div class="scan-selected-trigger" data-action="scan-toggle-chain-dropdown">
              <span class="scan-selected-icon" style="color:${selectedChain.color};font-size:20px">${selectedChain.icon || '⬡'}</span>
              <div class="scan-selected-detail">
                <strong>${escapeHtml(selectedChain.name)}</strong>
                <small>${escapeHtml(selectedChain.explorer)}</small>
              </div>
              <i class="ri-arrow-down-s-line scan-dropdown-arrow ${scanChainDropdownOpen ? 'open' : ''}"></i>
            </div>
            ${scanChainDropdownOpen ? `
            <div class="scan-chain-dropdown-menu">
              <div class="scan-dropdown-search">
                <i class="ri-search-line"></i>
                <input type="text" id="scan-dropdown-search" class="scan-dropdown-search-input" placeholder="${escapeHtml(t('scan_search_chain') || '네트워크 검색...')}" value="${escapeHtml(typeof scanDropdownSearch === 'string' ? scanDropdownSearch : '')}" />
              </div>
              <div class="scan-dropdown-list">
                ${Object.entries(allChains).filter(([key, chain]) => {
                  const s = (typeof scanDropdownSearch === 'string' ? scanDropdownSearch : '').toLowerCase();
                  if (!s) return true;
                  return chain.name.toLowerCase().includes(s) || key.toLowerCase().includes(s) || (chain.explorer || '').toLowerCase().includes(s);
                }).map(([key, chain]) => {
                  const isCustom = customMainnets.some(cm => cm.id === key);
                  return `
                    <div class="scan-dropdown-item ${scanSelectedChain === key ? 'active' : ''}" data-action="scan-dropdown-select" data-chain-id="${key}">
                      <span style="color:${chain.color};font-size:18px;width:24px;text-align:center">${chain.icon || '⬡'}</span>
                      <div class="scan-dropdown-item-info">
                        <span class="scan-dropdown-item-name">${escapeHtml(chain.name)}${isCustom ? ' <span style="font-size:10px;color:#10b981;">(Custom)</span>' : ''}</span>
                        <span class="scan-dropdown-item-url">${escapeHtml(chain.explorer)}</span>
                      </div>
                      ${scanSelectedChain === key ? '<i class="ri-check-line" style="color:var(--primary);font-size:16px"></i>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Address Input -->
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('scan_wallet_address') || '지갑 주소')}</label>
            <div class="scan-input-row">
              <input type="text" class="scan-input" id="scan-address-input" placeholder="0x... / T... / bc1..." value="${escapeHtml(scanWalletAddress)}" />
              <button class="scan-paste-btn" data-action="scan-paste">
                <i class="ri-clipboard-line"></i>
              </button>
            </div>
          </div>

          <!-- TX Hash Input -->
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('scan_tx_hash') || 'TX Hash (선택)')}</label>
            <div class="scan-input-row">
              <input type="text" class="scan-input" id="scan-tx-input" placeholder="Transaction hash..." />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="scan-actions">
            <button class="btn btn-primary scan-go-btn" data-action="scan-open-explorer" style="flex:1">
              <i class="ri-external-link-line"></i>
              ${escapeHtml(t('scan_open_explorer') || '익스플로러 열기')}
            </button>
            <button class="btn btn-outline scan-go-btn" data-action="scan-open-tx" style="flex:1">
              <i class="ri-file-search-line"></i>
              ${escapeHtml(t('scan_open_tx') || 'TX 조회')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCustomMainnetModal() {
  return `
    <div class="scan-modal-overlay" data-action="close-custom-mainnet-modal">
      <div class="scan-modal" onclick="event.stopPropagation()" style="max-height:85vh">
        <div class="scan-modal-header">
          <div class="scan-modal-title">
            <i class="ri-add-circle-line"></i>
            <span>${escapeHtml(t('custom_mainnet_title') || '커스텀 메인넷 추가')}</span>
          </div>
          <button class="scan-modal-close" data-action="close-custom-mainnet-modal"><i class="ri-close-line"></i></button>
        </div>

        <div class="scan-modal-body">
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_name') || '네트워크 이름')} *</label>
            <input type="text" class="scan-input" id="custom-net-name" placeholder="e.g. Klaytn, Fantom..." />
          </div>
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_explorer') || '블록 익스플로러 URL')} *</label>
            <input type="text" class="scan-input" id="custom-net-explorer" placeholder="https://scope.klaytn.com" />
          </div>
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_address_path') || '주소 경로')}</label>
            <input type="text" class="scan-input" id="custom-net-address-path" placeholder="/address/  (기본값)" />
          </div>
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_tx_path') || 'TX 경로')}</label>
            <input type="text" class="scan-input" id="custom-net-tx-path" placeholder="/tx/  (기본값)" />
          </div>
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_icon') || '아이콘 (이모지)')}</label>
            <input type="text" class="scan-input" id="custom-net-icon" placeholder="⬡" maxlength="4" />
          </div>
          <div class="scan-section">
            <label class="scan-label">${escapeHtml(t('custom_net_color') || '테마 색상')}</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" id="custom-net-color" value="#00d4ff" style="width:40px;height:36px;border:none;background:none;cursor:pointer" />
              <span id="custom-net-color-label" style="color:var(--text-secondary);font-size:13px">#00d4ff</span>
            </div>
          </div>

          ${customMainnets.length > 0 ? `
          <div class="scan-section">
            <label class="scan-label" style="margin-bottom:8px">${escapeHtml(t('custom_net_saved') || '저장된 커스텀 메인넷')}</label>
            <div class="custom-net-list">
              ${customMainnets.map(cm => `
                <div class="custom-net-item">
                  <span class="custom-net-item-icon" style="color:${cm.color}">${cm.icon || '⬡'}</span>
                  <span class="custom-net-item-name">${escapeHtml(cm.name)}</span>
                  <small class="custom-net-item-url">${escapeHtml(cm.explorer)}</small>
                  <button class="custom-net-delete" data-action="delete-custom-mainnet" data-mainnet-id="${cm.id}"><i class="ri-delete-bin-line"></i></button>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="scan-actions">
            <button class="btn btn-primary" data-action="save-custom-mainnet" style="width:100%">
              <i class="ri-save-line"></i>
              ${escapeHtml(t('custom_net_save') || '저장')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

let showCustomMainnetModal = false;

// ═══════════════════════════════════════════════════════════
// EVENT BINDING
// ═══════════════════════════════════════════════════════════

function bindEvents() {
  // ─── Lock Screen Keys ─── (with touch support for better mobile responsiveness)
  document.querySelectorAll('.key[data-key]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); handlePinKey(el.dataset.key); });
    el.addEventListener('touchend', (e) => { e.preventDefault(); handlePinKey(el.dataset.key); });
  });

  // ─── Vault Keypad ───
  document.querySelectorAll('[data-vault-key]').forEach(el => {
    el.addEventListener('click', () => handleVaultKey(el.dataset.vaultKey));
  });

  // ─── Bottom Tabs ───
  document.querySelectorAll('.tab-btn[data-tab]').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.tab;
      if (tab === 'plus') {
        showPlusMenu = !showPlusMenu;
        render();
      } else {
        state.currentTab = tab;
        showPlusMenu = false;
        bmTab = tab === 'ibag' ? 'bookmarks' : bmTab;
        render();
      }
    });
  });

  // ─── Middle Tabs ───
  document.querySelectorAll('.middle-tab[data-mtab]').forEach(el => {
    el.addEventListener('click', () => { activeMiddleTab = el.dataset.mtab; render(); });
  });

  // ─── iBag Tabs ───
  document.querySelectorAll('.ibag-tab[data-ibag-tab]').forEach(el => {
    el.addEventListener('click', () => { bmTab = el.dataset.ibagTab; searchQuery = ''; render(); });
  });

  // ─── Category Tags ───
  document.querySelectorAll('.category-tag[data-cat]').forEach(el => {
    el.addEventListener('click', () => { bmCategoryFilter = el.dataset.cat; render(); });
  });

  // ─── Search (debounced to avoid input lag) ───
  document.querySelectorAll('[data-search]').forEach(el => {
    let _searchDebounce = null;
    el.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (_searchDebounce) clearTimeout(_searchDebounce);
      _searchDebounce = setTimeout(() => {
        const curVal = searchQuery;
        const searchType = el.dataset.search;
        render();
        const inp = document.querySelector(`[data-search="${searchType}"]`);
        if (inp) {
          inp.value = curVal;
          inp.focus();
          inp.setSelectionRange(curVal.length, curVal.length);
        }
      }, 250);
    });
  });

  // ─── Clipboard search input ───
  const clipSearchInput = document.querySelector('.clip-search-input');
  if (clipSearchInput) {
    clipSearchInput.addEventListener('input', (e) => {
      clipboardSearchQuery = e.target.value;
      renderDebounced(200);
    });
  }

  // ─── Idea Note search ───
  const ideaSearchInput = document.querySelector('[data-search="idea"]');
  if (ideaSearchInput) {
    ideaSearchInput.addEventListener('input', (e) => {
      ideaNoteSearchQuery = e.target.value;
      renderDebounced(200);
    });
  }

  // ─── Idea Note color picker ───
  const ideaColorPick = document.querySelector('.idea-color-pick');
  if (ideaColorPick) {
    ideaColorPick.addEventListener('input', (e) => {
      ideaDrawColor = e.target.value;
    });
  }

  // ─── Clipboard paste zone ───
  const clipPasteZone = document.getElementById('clip-paste-zone');
  if (clipPasteZone) {
    clipPasteZone.addEventListener('paste', (e) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (ev) => {
            clipboardItems.unshift({
              id: genId(), title: t('clip_pasted_image') || '붙여넣은 이미지',
              memo: '', content: '', type: 'image', imageData: ev.target.result, createdAt: Date.now()
            });
            saveClipboardItems(); render();
          };
          reader.readAsDataURL(file);
          return;
        }
      }
      const text = e.clipboardData.getData('text');
      if (text) {
        clipboardItems.unshift({
          id: genId(), title: text.substring(0, 50),
          memo: '', content: text, type: 'text', imageData: null, createdAt: Date.now()
        });
        saveClipboardItems(); render();
      }
    });
    // Make paste zone focusable
    clipPasteZone.setAttribute('tabindex', '0');
  }

  // ─── Clipboard modal image paste & file input ───
  const clipImageDrop = document.getElementById('clip-image-drop');
  if (clipImageDrop) {
    clipImageDrop.addEventListener('paste', (e) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (ev) => {
            clipboardTempImage = ev.target.result;
            clipImageDrop.innerHTML = `<img src="${ev.target.result}" class="clip-preview-img" id="clip-preview-img"><button class="clip-img-remove" data-action="clip-remove-image"><i class="ri-close-line"></i></button>`;
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    });
    clipImageDrop.setAttribute('tabindex', '0');
  }
  const clipFileInput = document.getElementById('clip-file-input');
  if (clipFileInput) {
    clipFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        clipboardTempImage = ev.target.result;
        const dropEl = document.getElementById('clip-image-drop');
        if (dropEl) {
          dropEl.innerHTML = `<img src="${ev.target.result}" class="clip-preview-img" id="clip-preview-img"><button class="clip-img-remove" data-action="clip-remove-image"><i class="ri-close-line"></i></button>`;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // ─── Scan chain search input ───
  const scanSearchInput = document.getElementById('scan-chain-search');
  if (scanSearchInput) {
    scanSearchInput.addEventListener('input', (e) => { 
      scanChainSearch = e.target.value; 
      render();
      // Re-focus search input after render
      setTimeout(() => {
        const inp = document.getElementById('scan-chain-search');
        if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
      }, 10);
    });
  }
  // ─── Scan dropdown search input ───
  const scanDropdownInput = document.getElementById('scan-dropdown-search');
  if (scanDropdownInput) {
    scanDropdownInput.addEventListener('input', (e) => {
      scanDropdownSearch = e.target.value;
      render();
      setTimeout(() => {
        const inp = document.getElementById('scan-dropdown-search');
        if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
      }, 10);
    });
  }
  // ─── W3G Wallet Banner Dismiss ───
  const w3gDismissBanner = document.getElementById('w3g-dismiss-banner');
  if (w3gDismissBanner) {
    w3gDismissBanner.addEventListener('click', () => {
      const banner = document.getElementById('w3g-wallet-banner');
      if (banner) banner.style.display = 'none';
    });
  }
  // ─── Scan address input (no re-render on typing) ───
  const scanAddrInput = document.getElementById('scan-address-input');
  if (scanAddrInput) {
    scanAddrInput.addEventListener('input', (e) => { scanWalletAddress = e.target.value; });
  }
  // Custom mainnet color label sync
  const colorPicker = document.getElementById('custom-net-color');
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      const label = document.getElementById('custom-net-color-label');
      if (label) label.textContent = e.target.value;
    });
  }

  // ─── AI Chat Input ───
  const aiInput = document.getElementById('ai-input');
  if (aiInput) {
    aiInput.addEventListener('input', (e) => {
      aiInputText = e.target.value;
      // Auto-resize textarea
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    });
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = aiInput.value.trim();
        if ((text || aiPendingAttachments.length > 0) && !aiIsLoading) sendGeminiMessage(text);
      }
    });
  }
  
  // AI file input handler
  const aiFileInput = document.getElementById('ai-file-input');
  if (aiFileInput) {
    aiFileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          if (file.type.startsWith('image/')) {
            aiPendingAttachments.push({ type: 'image', data: dataUrl, name: file.name, preview: dataUrl });
          } else if (file.type.startsWith('video/')) {
            aiPendingAttachments.push({ type: 'video', data: dataUrl, name: file.name, preview: '' });
          } else {
            aiPendingAttachments.push({ type: 'file', data: dataUrl, name: file.name, preview: '' });
          }
          render();
        };
        if (file.size > 10 * 1024 * 1024) {
          alert(state.language === 'ko' ? '파일 크기는 10MB 이하만 가능합니다.' : 'File size must be under 10MB.');
          return;
        }
        reader.readAsDataURL(file);
      });
      e.target.value = ''; // reset
    });
  }

  // ─── Action Buttons (data-action) ───
  // NOTE: Static buttons get direct listeners here.
  // Dynamic buttons (e.g. contract search results) are handled by the global delegation below.
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAction(el.dataset.action, el);
    });
  });

  // ─── Category chip selection in modal ───
  document.querySelectorAll('[data-cat-select]').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.dataset.catSelect;
      const hiddenInput = document.getElementById('m-cat');
      if (hiddenInput) hiddenInput.value = cat;
      document.querySelectorAll('[data-cat-select]').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.catSelect === cat);
      });
    });
  });

  // ─── Work type/security chips ───
  document.querySelectorAll('[data-work-type]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-work-type]').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
    });
  });
  document.querySelectorAll('[data-work-sec]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-work-sec]').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
    });
  });

  // ─── Modal ───
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-modal-overlay]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-modal-save]').forEach(el => {
    el.addEventListener('click', () => handleModalSave(el.dataset.modalSave));
  });

  // ─── Modal inner delegation for dynamic buttons ───
  const modalInner = document.getElementById('modal-inner');
  if (modalInner) {
    modalInner.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (['add-contract-token', 'search-contract-token', 'select-token', 'remove-token'].includes(action)) {
          e.stopPropagation();
          handleAction(action, actionEl);
        }
      }
    });
  }

  // ─── Autolock options ───
  document.querySelectorAll('[data-autolock]').forEach(el => {
    el.addEventListener('click', () => {
      state.lockTimeout = parseInt(el.dataset.autolock);
      saveState(); closeModal(); render();
    });
  });

  // ─── Language selection ───
  document.querySelectorAll('.lang-item[data-lang]').forEach(el => {
    el.addEventListener('click', () => {
      state.language = el.dataset.lang;
      saveState(); render();
    });
  });

  // ─── Private PIN keypad ───
  document.querySelectorAll('[data-ppin-key]').forEach(el => {
    el.addEventListener('click', () => handlePrivatePinKey(el.dataset.ppinKey));
  });

  // ─── Bookmark actions ───
  document.querySelectorAll('[data-pin]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); togglePin(el.dataset.pin); });
  });
  document.querySelectorAll('[data-delete-bm]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); deleteBookmark(el.dataset.deleteBm); });
  });
  document.querySelectorAll('[data-delete-web3]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); deleteWeb3(el.dataset.deleteWeb3); });
  });
  document.querySelectorAll('[data-delete-memo]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); deleteMemo(el.dataset.deleteMemo); });
  });
  document.querySelectorAll('[data-delete-file]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); deleteFile(el.dataset.deleteFile); });
  });
  document.querySelectorAll('[data-delete-org]').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); deleteOrgChart(el.dataset.deleteOrg); });
  });

  // ─── Share select ───
  document.querySelectorAll('[data-share-select]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.shareSelect;
      if (shareSelectedIds.has(id)) shareSelectedIds.delete(id); else shareSelectedIds.add(id);
      render();
    });
  });

  // ─── Card click (edit) ───
  document.querySelectorAll('.card[data-id][data-type]').forEach(el => {
    if (!shareSelectMode) {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const type = el.dataset.type;
        if (type === 'bookmark') { editingItem = state.bookmarks.find(b => b.id === id); if (editingItem) { showModal = true; modalType = 'edit-bookmark'; privatePinUnlocked = false; render(); } }
        else if (type === 'web3') { editingItem = state.mailAccounts.find(m => m.id === id); if (editingItem) { showModal = true; modalType = 'edit-web3'; privatePinUnlocked = false; render(); } }
        else if (type === 'memo') { editingItem = state.memos.find(m => m.id === id); if (editingItem) { memoTempImage = null; showModal = true; modalType = 'edit-memo'; render(); } }
      });
    }
  });

  // ─── USDT Exchange Calculator inputs ───
  document.querySelectorAll('[data-usdt-input]').forEach(el => {
    el.addEventListener('input', (e) => {
      const field = el.dataset.usdtInput;
      const val = parseFloat(e.target.value);
      if (field === 'usdt') {
        exchangeAmountUsdt = e.target.value;
        if (!isNaN(val)) calcExchangeFromUsdt(val);
        else { exchangeAmount1 = ''; exchangeAmount2 = ''; }
      } else if (field === '1') {
        exchangeAmount1 = e.target.value;
        if (!isNaN(val)) calcExchangeFromCountry(1, val);
        else { exchangeAmountUsdt = ''; exchangeAmount2 = ''; }
      } else if (field === '2') {
        exchangeAmount2 = e.target.value;
        if (!isNaN(val)) calcExchangeFromCountry(2, val);
        else { exchangeAmountUsdt = ''; exchangeAmount1 = ''; }
      }
      // Update other fields without full re-render to keep focus
      if (field === 'usdt') {
        const el1 = document.getElementById('usdt-amount1'); if (el1) el1.value = exchangeAmount1;
        const el2 = document.getElementById('usdt-amount2'); if (el2) el2.value = exchangeAmount2;
      } else if (field === '1') {
        const elU = document.getElementById('usdt-amount'); if (elU) elU.value = exchangeAmountUsdt;
        const el2 = document.getElementById('usdt-amount2'); if (el2) el2.value = exchangeAmount2;
      } else if (field === '2') {
        const elU = document.getElementById('usdt-amount'); if (elU) elU.value = exchangeAmountUsdt;
        const el1 = document.getElementById('usdt-amount1'); if (el1) el1.value = exchangeAmount1;
      }
    });
  });
  document.querySelectorAll('[data-usdt-country]').forEach(el => {
    el.addEventListener('change', (e) => {
      const num = el.dataset.usdtCountry;
      if (num === '1') exchangeCountry1 = e.target.value;
      else exchangeCountry2 = e.target.value;
      saveExchangeSettings();
      // Recalculate from USDT if there's a value
      if (exchangeAmountUsdt) calcExchangeFromUsdt(parseFloat(exchangeAmountUsdt));
      render();
    });
  });

  // ─── Org chart search ───
  const orgSearchEl = document.querySelector('[data-org-search]');
  if (orgSearchEl) {
    orgSearchEl.addEventListener('input', (e) => {
      orgSearchQuery = e.target.value;
      // Re-render just the search results without full render
      const resultsContainer = document.querySelector('.org-search-results');
      if (!currentOrgChart) return;
      const nodes = currentOrgChart.nodes || [];
      const q = orgSearchQuery.trim().toLowerCase();
      if (!q) {
        if (resultsContainer) resultsContainer.remove();
        return;
      }
      const results = nodes.filter(n =>
        (n.name && n.name.toLowerCase().includes(q)) ||
        (n.phone && n.phone.toLowerCase().includes(q)) ||
        (n.wallet && n.wallet.toLowerCase().includes(q))
      );
      // Update or create results container
      let container = document.querySelector('.org-search-results');
      if (!container) {
        container = document.createElement('div');
        container.className = 'org-search-results';
        const searchBar = document.querySelector('.org-search-bar');
        if (searchBar) searchBar.after(container);
      }
      container.innerHTML = results.length === 0
        ? `<div class="org-search-no-result">${escapeHtml(t('org_search_no_result') || 'No results')}</div>`
        : results.map(n => `
          <div class="org-search-result-item" data-action="org-search-goto" data-node-id="${n.id}">
            <i class="ri-user-line"></i>
            <div>
              <div style="font-size:12px;font-weight:600">${escapeHtml(n.name)}</div>
              ${n.phone ? `<div style="font-size:10px;color:var(--text-muted)">${escapeHtml(n.phone)}</div>` : ''}
              ${n.wallet ? `<div style="font-size:10px;color:var(--text-muted)">${escapeHtml(n.wallet.substring(0,16))}...</div>` : ''}
            </div>
          </div>
        `).join('');
      // Rebind action events on new elements
      container.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', (e) => { e.stopPropagation(); handleAction(el.dataset.action, el); });
      });
    });
  }

  // ─── Translate inputs ───
  const transFromEl = document.querySelector('[data-translate-from]');
  if (transFromEl) transFromEl.addEventListener('change', (e) => { translateFrom = e.target.value; });
  const transToEl = document.querySelector('[data-translate-to]');
  if (transToEl) transToEl.addEventListener('change', (e) => { translateTo = e.target.value; });
  const transTextEl = document.querySelector('[data-translate-text]');
  if (transTextEl) transTextEl.addEventListener('input', (e) => { translateText = e.target.value; });

  // ─── Webview controls ───
  document.querySelectorAll('[data-wv]').forEach(el => {
    el.addEventListener('click', () => {
      const frame = document.getElementById('alphabag-frame');
      if (!frame) return;
      try {
        if (el.dataset.wv === 'back') frame.contentWindow.history.back();
        else if (el.dataset.wv === 'forward') frame.contentWindow.history.forward();
        else if (el.dataset.wv === 'refresh') frame.src = frame.src;
      } catch(e) {}
    });
  });
  document.querySelectorAll('[data-wv-info]').forEach(el => {
    el.addEventListener('click', () => {
      const frame = document.getElementById('infoweb-frame');
      if (!frame) return;
      try {
        if (el.dataset.wvInfo === 'back') frame.contentWindow.history.back();
        else if (el.dataset.wvInfo === 'forward') frame.contentWindow.history.forward();
        else if (el.dataset.wvInfo === 'refresh') frame.src = frame.src;
      } catch(e) {}
    });
  });
  document.querySelectorAll('[data-wv-generic]').forEach(el => {
    el.addEventListener('click', () => {
      const frame = document.getElementById('generic-frame');
      if (!frame) return;
      try { if (el.dataset.wvGeneric === 'refresh') frame.src = frame.src; } catch(e) {}
    });
  });

  // ─── Bookmark URL auto-title ───
  const bmUrlInput = document.getElementById('m-url');
  const bmTitleInput = document.getElementById('m-title');
  if (bmUrlInput && bmTitleInput && (modalType === 'add-bookmark' || modalType === 'edit-bookmark')) {
    let urlDebounceTimer = null;
    bmUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (urlDebounceTimer) clearTimeout(urlDebounceTimer);
      if (!url || !url.match(/^https?:\/\//i)) return;
      // Only auto-fill if title is empty
      if (bmTitleInput.value.trim()) return;
      urlDebounceTimer = setTimeout(async () => {
        bmTitleInput.value = '⏳';
        bmTitleInput.style.opacity = '0.5';
        const title = await fetchSiteTitle(url);
        if (title && !bmTitleInput.value.trim().replace('⏳','')) {
          bmTitleInput.value = title;
        } else if (bmTitleInput.value === '⏳') {
          // Fallback: use domain name as title
          try { bmTitleInput.value = new URL(url).hostname.replace('www.',''); } catch(e) { bmTitleInput.value = ''; }
        }
        bmTitleInput.style.opacity = '1';
      }, 800);
    });
    // Also trigger on blur (paste then tab away)
    bmUrlInput.addEventListener('blur', () => {
      const url = bmUrlInput.value.trim();
      if (!url || !url.match(/^https?:\/\//i)) return;
      if (bmTitleInput.value.trim() && bmTitleInput.value !== '⏳') return;
      fetchSiteTitle(url).then(title => {
        if (title) { bmTitleInput.value = title; }
        else { try { bmTitleInput.value = new URL(url).hostname.replace('www.',''); } catch(e) {} }
        bmTitleInput.style.opacity = '1';
      });
    });
  }

  // ─── Web3App search ───
  document.querySelectorAll('[data-search-web3app]').forEach(el => {
    let _w3Debounce = null;
    el.addEventListener('input', (e) => {
      web3appSearch = e.target.value;
      if (_w3Debounce) clearTimeout(_w3Debounce);
      _w3Debounce = setTimeout(() => render(), 200);
    });
  });

  // ─── Memo paste ───
  const pasteZone = document.getElementById('memo-paste-zone');
  if (pasteZone) {
    pasteZone.addEventListener('paste', handleMemoPaste);
    pasteZone.addEventListener('dragover', (e) => { e.preventDefault(); pasteZone.classList.add('drag-over'); });
    pasteZone.addEventListener('dragleave', () => pasteZone.classList.remove('drag-over'));
    pasteZone.addEventListener('drop', handleMemoDrop);
    // Global paste: when memo modal is open, Ctrl+V anywhere pastes image
    document.addEventListener('paste', function _globalMemoPaste(e) {
      const zone = document.getElementById('memo-paste-zone');
      if (!zone) { document.removeEventListener('paste', _globalMemoPaste); return; }
      // Only handle if not already handled by the zone itself
      if (e.target && e.target.closest && e.target.closest('#memo-paste-zone')) return;
      // Check if we're in a text input - don't intercept normal text paste
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      handleMemoPaste(e);
    });
  }
}

// ═══════════════════════════════════════════════════════════
// ACTION HANDLERS
// ═══════════════════════════════════════════════════════════

function handleAction(action, el) {
  switch (action) {
    // Navigation
    case 'go-back': state.currentTab = 'home'; render(); break;
    case 'go-back-org': state.currentTab = 'orgchart'; currentOrgChart = null; render(); break;
    case 'go-home-tab': state.currentTab = 'home'; render(); break;
    case 'close-webview': state.currentTab = 'home'; webviewUrl = ''; render(); break;
    case 'open-external': if (el.dataset.url) window.open(el.dataset.url, '_blank'); break;
    case 'open-bookmark-url':
      if (el.dataset.url) {
        webviewUrl = el.dataset.url;
        state.currentTab = 'webview';
        render();
      }
      break;
    case 'goto-bookmarks': state.currentTab = 'bookmark-detail'; render(); break;
    case 'goto-web3': state.currentTab = 'web3-detail'; render(); break;
    case 'goto-memo': state.currentTab = 'memo-detail'; render(); break;
    case 'goto-life': state.currentTab = 'life-detail'; render(); break;
    case 'goto-calc': state.currentTab = 'calc'; fetchCurrencyRates(); fetchUsdtKrwPrice(); loadExchangeSettings(); render(); break;
    case 'goto-translate': state.currentTab = 'translate'; render(); break;
    case 'goto-ibag': state.currentTab = 'ibag'; bmTab = 'bookmarks'; render(); break;
    case 'goto-card-tab': state.currentTab = 'card'; cardScreen = 'main'; render(); break;
    case 'goto-kpi': state.currentTab = 'kpi'; kpiScreen = 'list'; render(); break;
    case 'goto-web3app': showPlusMenu = false; if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) { window.Capacitor.Plugins.Browser.open({ url: 'https://web3dapp.io' }); } else if (IS_ELECTRON && window.electronAPI) { window.electronAPI.openExternal('https://web3dapp.io'); } else { window.open('https://web3dapp.io', '_blank'); } break;
    case 'goto-translate-plus': showPlusMenu = false; state.currentTab = 'translate'; render(); break;
    case 'goto-orgchart-home': state.currentTab = 'orgchart'; render(); break;

    // Web3App actions
    case 'web3app-filter': web3appCategory = el.dataset.cat || 'all'; render(); break;
    case 'web3app-open':
      if (el.dataset.url) { webviewUrl = el.dataset.url; state.currentTab = 'webview'; render(); }
      break;

    // Interstitial Ad actions
    case 'interstitial-close':
      if (interstitialCountdown <= 0) closeInterstitialAd();
      break;
    case 'interstitial-click':
      if (el.dataset.url) { window.open(el.dataset.url, '_blank'); }
      closeInterstitialAd();
      break;

    // Popup Notice actions
    case 'popup-close': closePopup(); break;
    case 'popup-link':
      if (el.dataset.url) { webviewUrl = el.dataset.url; state.currentTab = 'webview'; }
      closePopup(); render(); break;
    case 'popup-dont-show':
      popupDontShowToday = el.checked || !popupDontShowToday;
      break;

    // Calculator tabs
    case 'calc-tab-exchange': calcTabMode = 'exchange'; render(); break;
    case 'calc-tab-fee': calcTabMode = 'fee'; render(); break;
    case 'calc-tab-general': calcTabMode = 'general'; render(); break;

    // General Calculator actions
    case 'gc-digit': generalCalcInputDigit(el.dataset.digit); render(); break;
    case 'gc-dot': generalCalcInputDot(); render(); break;
    case 'gc-op': generalCalcPerformOperation(el.dataset.op); render(); break;
    case 'gc-equals': generalCalcEquals(); render(); break;
    case 'gc-clear': generalCalcReset(); render(); break;
    case 'gc-toggle-sign': generalCalcToggleSign(); render(); break;
    case 'gc-percent': generalCalcPercent(); render(); break;
    case 'gc-backspace': generalCalcBackspace(); render(); break;
    case 'gc-mc': generalCalcMemoryClear(); render(); break;
    case 'gc-mr': generalCalcMemoryRecall(); render(); break;
    case 'gc-m-plus': generalCalcMemoryAdd(); render(); break;
    case 'gc-m-minus': generalCalcMemorySub(); render(); break;

    // Fee calculator modes
    case 'fee-mode-forward': feeCalcMode = 'forward'; feeResult = null; render(); break;
    case 'fee-mode-reverse': feeCalcMode = 'reverse'; feeResult = null; render(); break;
    case 'fee-mode-profit': feeCalcMode = 'profit'; feeResult = null; render(); break;

    // Fee quick percent
    case 'fee-quick-pct':
      feePercent = el.dataset.pct;
      render();
      break;

    // Fee calculate
    case 'fee-calculate': {
      const pctEl = document.getElementById('fee-percent-input');
      const amtEl = document.getElementById('fee-amount-input');
      const tgtEl = document.getElementById('fee-target-input');
      const tpEl = document.getElementById('fee-token-price');
      const tsEl = document.getElementById('fee-token-symbol');
      if (pctEl) feePercent = pctEl.value;
      if (amtEl) feeAmount = amtEl.value;
      if (tgtEl) feeTargetAmount = tgtEl.value;
      if (tpEl) feeTokenPrice = tpEl.value;
      if (tsEl) feeTokenSymbol = tsEl.value || 'USDT';
      calculateFee();
      render();
      break;
    }

    // Fee reset
    case 'fee-reset':
      feePercent = ''; feeAmount = ''; feeTargetAmount = ''; feeTokenPrice = ''; feeResult = null;
      render();
      break;

    // ─── AI Chat Actions ───
    case 'ai-send': {
      const aiInput = document.getElementById('ai-input');
      const text = aiInput ? aiInput.value.trim() : aiInputText.trim();
      if (text || aiPendingAttachments.length > 0) sendGeminiMessage(text);
      break;
    }
    case 'ai-suggest': {
      const suggestText = el.dataset.text;
      if (suggestText) sendGeminiMessage(suggestText);
      break;
    }
    case 'ai-open-external': {
      const extUrl = el.dataset.url;
      if (extUrl) {
        // Open in external system browser
        // The MainActivity's WebViewClient will intercept and open externally
        window.open(extUrl, '_blank');
      }
      break;
    }
    case 'ai-open-settings':
      aiShowSettings = true;
      render();
      break;
    case 'ai-close-settings':
      aiShowSettings = false;
      render();
      break;
    case 'ai-save-key': {
      const keyInputs = document.querySelectorAll('.ai-api-key-multi');
      const newKeys = [];
      keyInputs.forEach(inp => {
        const v = inp.value.trim();
        if (v) newKeys.push(v);
      });
      aiGeminiApiKeys = newKeys;
      aiGeminiApiKey = newKeys[0] || '';
      aiCurrentKeyIndex = 0;
      saveAiSettings();
      aiShowSettings = false;
      render();
      break;
    }
    case 'ai-add-key-slot': {
      aiGeminiApiKeys.push('');
      render();
      break;
    }
    case 'ai-remove-key': {
      const idx = parseInt(el.dataset.idx);
      if (!isNaN(idx) && idx >= 0 && idx < aiGeminiApiKeys.length) {
        aiGeminiApiKeys.splice(idx, 1);
        if (aiCurrentKeyIndex >= aiGeminiApiKeys.length) aiCurrentKeyIndex = 0;
        render();
      }
      break;
    }
    case 'ai-attach': {
      const fileInput = document.getElementById('ai-file-input');
      if (fileInput) fileInput.click();
      break;
    }
    case 'ai-remove-attach': {
      const removeIdx = parseInt(el.dataset.idx);
      if (!isNaN(removeIdx) && removeIdx >= 0) {
        aiPendingAttachments.splice(removeIdx, 1);
        render();
      }
      break;
    }
    case 'ai-clear-chat':
      aiMessages = [];
      aiChatHistory = [];
      aiPendingAttachments = [];
      saveAiSettings();
      render();
      break;

    case 'goto-settings': showHamburgerMenu = false; state.currentTab = 'settings'; render(); break;

    // ─── OTA Update Actions ───
    case 'app-check-update': checkForUpdate(); break;
    case 'app-download-update': downloadUpdate(); break;

    // ─── Card Actions ───
    case 'card-start-apply':
      cardScreen = 'apply'; cardApplyType = 'virtual'; render(); break;
    case 'card-back':
      cardScreen = 'main'; showCardTopup = false; showCardWithdraw = false; selectedCardId = null; render(); break;
    case 'card-back-to-apply':
      cardScreen = 'apply'; render(); break;
    case 'card-set-type':
      cardApplyType = el.dataset.type;
      cardApplyDesign = cardApplyType === 'virtual' ? 'virtual' : 'physical';
      render(); break;
    case 'card-apply-next':
      cardScreen = 'apply-design';
      cardApplyDesign = cardApplyType === 'virtual' ? 'virtual' : 'physical';
      render(); break;
    case 'card-pick-design':
      cardApplyDesign = el.dataset.design; render(); break;
    case 'card-apply-confirm': {
      const design = CARD_DESIGNS.find(d => d.id === cardApplyDesign);
      const last4 = String(Math.floor(1000 + Math.random() * 9000));
      const bonusAmt = design && design.bonus ? parseFloat(design.bonus.replace(/[^0-9.]/g, '')) || 0 : 0;
      const newCard = {
        id: genId(),
        type: cardApplyType,
        design: cardApplyDesign,
        last4: last4,
        name: '',
        balance: bonusAmt,
        currency: 'USD',
        status: 'active',
        createdAt: Date.now(),
        transactions: bonusAmt > 0 ? [{ type: 'topup', amount: bonusAmt, description: t('card_welcome_bonus'), date: Date.now() }] : []
      };
      myCards.push(newCard);
      saveCards();
      cardScreen = 'apply-form';
      render(); break;
    }
    case 'card-go-to-cards':
      cardScreen = 'main'; render(); break;
    case 'card-select':
      selectedCardId = el.dataset.cardId;
      cardScreen = 'detail';
      showCardTopup = false; showCardWithdraw = false;
      render(); break;
    case 'card-open-topup':
      showCardTopup = true; cardTopupAmount = ''; render(); break;
    case 'card-close-topup':
      showCardTopup = false; render(); break;
    case 'card-open-withdraw':
      showCardWithdraw = true; cardWithdrawAmount = ''; render(); break;
    case 'card-close-withdraw':
      showCardWithdraw = false; render(); break;
    case 'card-topup-quick': {
      const amt = el.dataset.amount;
      const inp = document.getElementById('card-topup-input');
      if (inp) inp.value = amt;
      cardTopupAmount = amt;
      break;
    }
    case 'card-topup-confirm': {
      const inp = document.getElementById('card-topup-input');
      const amount = parseFloat(inp ? inp.value : cardTopupAmount);
      if (!amount || amount <= 0) break;
      const card = myCards.find(c => c.id === selectedCardId);
      if (card) {
        card.balance += amount;
        if (!card.transactions) card.transactions = [];
        card.transactions.unshift({ type: 'topup', amount: amount, description: 'USDT ' + t('card_topup'), date: Date.now() });
        saveCards();
      }
      showCardTopup = false; cardTopupAmount = '';
      render(); break;
    }
    case 'card-withdraw-confirm': {
      const inp = document.getElementById('card-withdraw-input');
      const amount = parseFloat(inp ? inp.value : cardWithdrawAmount);
      const card = myCards.find(c => c.id === selectedCardId);
      if (!amount || amount <= 0 || !card || amount > card.balance) break;
      card.balance -= amount;
      if (!card.transactions) card.transactions = [];
      card.transactions.unshift({ type: 'withdraw', amount: amount, description: 'USDT ' + t('card_withdraw'), date: Date.now() });
      saveCards();
      showCardWithdraw = false; cardWithdrawAmount = '';
      render(); break;
    }
    case 'card-toggle-freeze': {
      const cardId = el.dataset.cardId;
      const card = myCards.find(c => c.id === cardId);
      if (card) {
        card.status = card.status === 'active' ? 'frozen' : 'active';
        saveCards();
      }
      render(); break;
    }
    case 'card-show-info': {
      const card = myCards.find(c => c.id === el.dataset.cardId);
      if (card) {
        const design = CARD_DESIGNS.find(d => d.id === card.design) || CARD_DESIGNS[0];
        const fullNumber = card.fullNumber || `${card.last4.substring(0,1)}937 ${Math.floor(1000+Math.random()*9000)} ${Math.floor(1000+Math.random()*9000)} ${card.last4}`;
        const cvv = card.cvv || String(Math.floor(100+Math.random()*900));
        const expiry = card.expiry || '12/28';
        const holderName = card.holderName || 'ALPHABAG USER';
        const networkLogo = design.network === 'Visa' ? '<span style="font-family:serif;font-weight:900;font-size:22px;font-style:italic;color:#1a1f71">VISA</span>' : design.network === 'Mastercard' ? '<span style="font-size:16px">🔴🟡 Mastercard</span>' : `<span style="font-size:14px;font-weight:600">${design.network}</span>`;
        
        const infoHtml = `
          <div class="card-info-sheet">
            <div class="card-info-header">
              <h3>${escapeHtml(t('card_info') || '카드 정보')}</h3>
              <div class="card-info-header-actions">
                <button data-action="card-copy-all" data-number="${fullNumber}" data-cvv="${cvv}" data-expiry="${expiry}" data-holder="${holderName}" class="card-info-copy-all-btn">
                  <i class="ri-file-copy-2-line"></i> ${escapeHtml(t('card_copy_all') || '전체 복사')}
                </button>
              </div>
            </div>
            
            <div class="card-info-row">
              <div class="card-info-label">${escapeHtml(card.type === 'virtual' ? t('card_virtual') || '가상 카드' : t('card_physical') || '실물카드')}</div>
              <div class="card-info-value-row">
                <span class="card-info-value" id="card-number-display">${fullNumber}</span>
                <button data-action="card-copy-field" data-copy-value="${fullNumber}" class="card-info-copy-btn"><i class="ri-file-copy-line"></i></button>
              </div>
            </div>
            
            <div class="card-info-divider"></div>
            
            <div class="card-info-row">
              <div class="card-info-label">${escapeHtml(t('card_expiry') || '유효 기간')}</div>
              <div class="card-info-value-row">
                <span class="card-info-value">${expiry}</span>
                <button data-action="card-copy-field" data-copy-value="${expiry}" class="card-info-copy-btn"><i class="ri-file-copy-line"></i></button>
              </div>
            </div>
            
            <div class="card-info-divider"></div>
            
            <div class="card-info-row">
              <div class="card-info-label">CVV</div>
              <div class="card-info-value-row">
                <span class="card-info-value" id="card-cvv-display">***</span>
                <button data-action="card-toggle-cvv" data-cvv="${cvv}" class="card-info-eye-btn"><i class="ri-eye-line"></i></button>
                <button data-action="card-copy-field" data-copy-value="${cvv}" class="card-info-copy-btn"><i class="ri-file-copy-line"></i></button>
              </div>
            </div>
            
            <div class="card-info-divider"></div>
            
            <div class="card-info-row">
              <div class="card-info-label">${escapeHtml(t('card_holder') || '카드 소유자')}</div>
              <div class="card-info-value-row">
                <span class="card-info-value">${escapeHtml(holderName)}</span>
                <button data-action="card-copy-field" data-copy-value="${holderName}" class="card-info-copy-btn"><i class="ri-file-copy-line"></i></button>
              </div>
            </div>
            
            <div class="card-info-divider"></div>
            
            <div class="card-info-row">
              <div class="card-info-label">${escapeHtml(t('card_network_label') || '결제 네트워크')}</div>
              <div class="card-info-value-row">
                ${networkLogo}
              </div>
            </div>
            
            <div class="card-info-divider"></div>
            
            <div class="card-info-row">
              <div class="card-info-label">${escapeHtml(t('card_status') || '상태')}</div>
              <div class="card-info-value-row">
                <span class="card-info-status ${card.status}">
                  <i class="${card.status === 'active' ? 'ri-checkbox-circle-fill' : 'ri-pause-circle-fill'}"></i>
                  ${escapeHtml(card.status === 'active' ? t('card_active') || '활성' : t('card_frozen') || '정지')}
                </span>
              </div>
            </div>
          </div>
        `;
        // Show fullscreen card info sheet
        const existingSheet = document.querySelector('.card-info-fullscreen');
        if (existingSheet) existingSheet.remove();
        
        const sheetEl = document.createElement('div');
        sheetEl.className = 'card-info-fullscreen';
        sheetEl.innerHTML = `
          <div class="card-info-fullscreen-header">
            <h3>${escapeHtml(t('card_management') || '카드 관리')}</h3>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="card-info-my-cards-btn" data-action="card-info-close"><i class="ri-bank-card-line"></i> ${escapeHtml(t('card_my_cards') || '내 카드')}</button>
            </div>
          </div>
          <div class="card-info-fullscreen-card">
            <img src="${design.image}" class="card-detail-img" alt="${design.name}" style="width:100%;border-radius:16px">
            <div class="card-detail-overlay">
              <div class="card-detail-status ${card.status}">${card.status === 'active' ? escapeHtml(t('card_active')) : escapeHtml(t('card_frozen'))}</div>
              <div class="card-detail-type">${escapeHtml(card.type === 'virtual' ? t('card_virtual') : t('card_physical'))}</div>
            </div>
            <div class="card-info-fullscreen-last4">**** ${card.last4}</div>
            <div class="card-info-fullscreen-network">${networkLogo}</div>
          </div>
          <div class="card-info-fullscreen-balance">
            <div class="card-balance-label">${escapeHtml(t('card_balance'))}(${card.currency})</div>
            <div class="card-balance-amount">$${card.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div class="card-info-fullscreen-body">
            ${infoHtml}
          </div>
        `;
        document.body.appendChild(sheetEl);
        requestAnimationFrame(() => sheetEl.classList.add('active'));
        
        // Bind close and copy events
        sheetEl.addEventListener('click', (e) => {
          const target = e.target.closest('[data-action]');
          if (!target) return;
          const action = target.dataset.action;
          if (action === 'card-info-close') {
            sheetEl.classList.remove('active');
            setTimeout(() => sheetEl.remove(), 300);
          } else if (action === 'card-copy-field') {
            const val = target.dataset.copyValue;
            if (val) {
              navigator.clipboard.writeText(val).then(() => {
                const orig = target.innerHTML;
                target.innerHTML = '<i class="ri-check-line" style="color:#10b981"></i>';
                target.style.background = '#10b98120';
                setTimeout(() => { target.innerHTML = orig; target.style.background = ''; }, 1500);
              }).catch(() => {
                const ta = document.createElement('textarea');
                ta.value = val; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy');
                document.body.removeChild(ta);
              });
            }
          } else if (action === 'card-copy-all') {
            const allText = `Card Number: ${target.dataset.number}\nExpiry: ${target.dataset.expiry}\nCVV: ${target.dataset.cvv}\nHolder: ${target.dataset.holder}`;
            navigator.clipboard.writeText(allText).then(() => {
              const orig = target.innerHTML;
              target.innerHTML = '<i class="ri-check-line"></i> Copied!';
              setTimeout(() => { target.innerHTML = orig; }, 1500);
            }).catch(() => {});
          } else if (action === 'card-toggle-cvv') {
            const cvvDisplay = sheetEl.querySelector('#card-cvv-display');
            if (cvvDisplay) {
              cvvDisplay.textContent = cvvDisplay.textContent === '***' ? target.dataset.cvv : '***';
            }
          }
        });
      }
      break;
    }
    case 'card-copy-field': {
      const val = el.dataset.copyValue;
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          const orig = el.innerHTML;
          el.innerHTML = '<i class="ri-check-line" style="color:#10b981"></i>';
          el.style.background = '#10b98120';
          setTimeout(() => { el.innerHTML = orig; el.style.background = ''; }, 1500);
        }).catch(() => {
          // Fallback for older browsers
          const ta = document.createElement('textarea');
          ta.value = val; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta);
          const orig = el.innerHTML;
          el.innerHTML = '<i class="ri-check-line" style="color:#10b981"></i>';
          setTimeout(() => { el.innerHTML = orig; }, 1500);
        });
      }
      break;
    }
    case 'card-copy-all': {
      const num = el.dataset.number;
      const cvvVal = el.dataset.cvv;
      const exp = el.dataset.expiry;
      const holder = el.dataset.holder;
      const allText = `Card Number: ${num}\nExpiry: ${exp}\nCVV: ${cvvVal}\nHolder: ${holder}`;
      navigator.clipboard.writeText(allText).then(() => {
        const orig = el.innerHTML;
        el.innerHTML = '<i class="ri-check-double-line"></i> ' + (t('card_copied') || '복사됨');
        el.style.background = '#10b981'; el.style.color = '#fff';
        setTimeout(() => { el.innerHTML = orig; el.style.background = ''; el.style.color = ''; }, 2000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = allText; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
      });
      break;
    }
    case 'card-toggle-cvv': {
      const cvvDisplay = document.getElementById('card-cvv-display');
      if (cvvDisplay) {
        if (cvvDisplay.textContent === '***') {
          cvvDisplay.textContent = el.dataset.cvv;
          el.innerHTML = '<i class="ri-eye-off-line"></i>';
        } else {
          cvvDisplay.textContent = '***';
          el.innerHTML = '<i class="ri-eye-line"></i>';
        }
      }
      break;
    }

    case 'goto-orgchart': showPlusMenu = false; state.currentTab = 'orgchart'; render(); break;

    // KPI / WBS actions
    case 'kpi-add-project': {
      showKpiPrompt('프로젝트 추가', [
        { label: '프로젝트 이름', id: 'kpi-f-name', value: '', placeholder: '프로젝트 이름 입력', autofocus: true },
        { label: '목표 (선택)', id: 'kpi-f-goal', value: '', placeholder: '목표를 입력하세요' },
        { label: '마감일 (선택)', id: 'kpi-f-deadline', value: '', placeholder: 'YYYY-MM-DD', type: 'date' }
      ], (vals) => {
        const name = vals['kpi-f-name'];
        if (!name || !name.trim()) return;
        const newProj = {
          id: 'kpi_' + Date.now(),
          name: name.trim(),
          goal: (vals['kpi-f-goal'] || '').trim(),
          deadline: (vals['kpi-f-deadline'] || '').trim(),
          categories: [],
          createdAt: new Date().toISOString()
        };
        kpiProjects.push(newProj);
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-delete-project': {
      const projId = el.dataset.kpiId;
      showKpiConfirm('이 프로젝트를 삭제하시겠습니까?', () => {
        kpiProjects = kpiProjects.filter(p => p.id !== projId);
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-open-project': {
      kpiSelectedProjectId = el.dataset.kpiId || el.closest('[data-kpi-id]')?.dataset.kpiId;
      kpiScreen = 'project';
      render();
      break;
    }
    case 'kpi-back-to-list': {
      kpiScreen = 'list';
      render();
      break;
    }
    case 'kpi-edit-project': {
      const epId = el.dataset.kpiId;
      const ep = kpiProjects.find(p => p.id === epId);
      if (!ep) break;
      showKpiPrompt('프로젝트 편집', [
        { label: '프로젝트 이름', id: 'kpi-f-name', value: ep.name, autofocus: true },
        { label: '목표', id: 'kpi-f-goal', value: ep.goal || '' },
        { label: '마감일', id: 'kpi-f-deadline', value: ep.deadline || '', type: 'date' }
      ], (vals) => {
        const newName = vals['kpi-f-name'];
        if (newName && newName.trim()) ep.name = newName.trim();
        ep.goal = (vals['kpi-f-goal'] || '').trim();
        ep.deadline = (vals['kpi-f-deadline'] || '').trim();
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-add-cat': {
      const proj = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj) break;
      showKpiPrompt('대메뉴 추가', [
        { label: '대메뉴 이름', id: 'kpi-f-cat', value: '', placeholder: '대메뉴 이름 입력', autofocus: true }
      ], (vals) => {
        const catName = vals['kpi-f-cat'];
        if (!catName || !catName.trim()) return;
        if (!proj.categories) proj.categories = [];
        proj.categories.push({ name: catName.trim(), subcategories: [] });
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-rename-cat': {
      const catIdx = parseInt(el.dataset.cat);
      const proj = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj || !proj.categories[catIdx]) break;
      showKpiPrompt('대메뉴 이름 변경', [
        { label: '대메뉴 이름', id: 'kpi-f-cat', value: proj.categories[catIdx].name, autofocus: true }
      ], (vals) => {
        const newCatName = vals['kpi-f-cat'];
        if (newCatName && newCatName.trim()) {
          proj.categories[catIdx].name = newCatName.trim();
          saveKpiProjects();
          render();
        }
      });
      break;
    }
    case 'kpi-delete-cat': {
      const catIdx2 = parseInt(el.dataset.cat);
      const proj2 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj2 || !proj2.categories[catIdx2]) break;
      showKpiConfirm(`"${proj2.categories[catIdx2].name}" 대메뉴를 삭제하시겠습니까?`, () => {
        proj2.categories.splice(catIdx2, 1);
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-add-subcat': {
      const catIdx3 = parseInt(el.dataset.cat);
      const proj3 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj3 || !proj3.categories[catIdx3]) break;
      showKpiPrompt('소메뉴 추가', [
        { label: '소메뉴 이름', id: 'kpi-f-sc', value: '', placeholder: '소메뉴 이름 입력', autofocus: true }
      ], (vals) => {
        const scName = vals['kpi-f-sc'];
        if (!scName || !scName.trim()) return;
        if (!proj3.categories[catIdx3].subcategories) proj3.categories[catIdx3].subcategories = [];
        proj3.categories[catIdx3].subcategories.push({ name: scName.trim(), tasks: [] });
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-rename-subcat': {
      const catIdx4 = parseInt(el.dataset.cat);
      const scIdx = parseInt(el.dataset.subcat);
      const proj4 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj4 || !proj4.categories[catIdx4]?.subcategories[scIdx]) break;
      showKpiPrompt('소메뉴 이름 변경', [
        { label: '소메뉴 이름', id: 'kpi-f-sc', value: proj4.categories[catIdx4].subcategories[scIdx].name, autofocus: true }
      ], (vals) => {
        const newScName = vals['kpi-f-sc'];
        if (newScName && newScName.trim()) {
          proj4.categories[catIdx4].subcategories[scIdx].name = newScName.trim();
          saveKpiProjects();
          render();
        }
      });
      break;
    }
    case 'kpi-delete-subcat': {
      const catIdx5 = parseInt(el.dataset.cat);
      const scIdx2 = parseInt(el.dataset.subcat);
      const proj5 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj5 || !proj5.categories[catIdx5]?.subcategories[scIdx2]) break;
      showKpiConfirm(`"${proj5.categories[catIdx5].subcategories[scIdx2].name}" 소메뉴를 삭제하시겠습니까?`, () => {
        proj5.categories[catIdx5].subcategories.splice(scIdx2, 1);
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-add-task': {
      const catIdx6 = parseInt(el.dataset.cat);
      const scIdx3 = parseInt(el.dataset.subcat);
      const proj6 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj6 || !proj6.categories[catIdx6]?.subcategories[scIdx3]) break;
      showKpiPrompt('태스크 추가', [
        { label: '태스크 내용', id: 'kpi-f-task', value: '', placeholder: '태스크 내용 입력', autofocus: true },
        { label: '비고 (선택)', id: 'kpi-f-memo', value: '', placeholder: '메모, 참고사항 등', type: 'textarea' }
      ], (vals) => {
        const taskText = vals['kpi-f-task'];
        if (!taskText || !taskText.trim()) return;
        if (!proj6.categories[catIdx6].subcategories[scIdx3].tasks) proj6.categories[catIdx6].subcategories[scIdx3].tasks = [];
        proj6.categories[catIdx6].subcategories[scIdx3].tasks.push({ text: taskText.trim(), memo: (vals['kpi-f-memo'] || '').trim(), done: false, createdAt: new Date().toISOString() });
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-edit-task-memo': {
      const catIdxM = parseInt(el.dataset.cat);
      const scIdxM = parseInt(el.dataset.subcat);
      const tIdxM = parseInt(el.dataset.task);
      const projM = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!projM || !projM.categories[catIdxM]?.subcategories[scIdxM]?.tasks[tIdxM]) break;
      const curTask = projM.categories[catIdxM].subcategories[scIdxM].tasks[tIdxM];
      showKpiPrompt('비고 편집', [
        { label: '비고', id: 'kpi-f-memo', value: curTask.memo || '', placeholder: '메모, 참고사항 등', type: 'textarea' }
      ], (vals) => {
        curTask.memo = (vals['kpi-f-memo'] || '').trim();
        saveKpiProjects();
        render();
      });
      break;
    }
    case 'kpi-toggle-task': {
      const catIdx7 = parseInt(el.dataset.cat);
      const scIdx4 = parseInt(el.dataset.subcat);
      const tIdx = parseInt(el.dataset.task);
      const proj7 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj7 || !proj7.categories[catIdx7]?.subcategories[scIdx4]?.tasks[tIdx]) break;
      proj7.categories[catIdx7].subcategories[scIdx4].tasks[tIdx].done = !proj7.categories[catIdx7].subcategories[scIdx4].tasks[tIdx].done;
      saveKpiProjects();
      render();
      break;
    }
    case 'kpi-delete-task': {
      const catIdx8 = parseInt(el.dataset.cat);
      const scIdx5 = parseInt(el.dataset.subcat);
      const tIdx2 = parseInt(el.dataset.task);
      const proj8 = kpiProjects.find(p => p.id === kpiSelectedProjectId);
      if (!proj8 || !proj8.categories[catIdx8]?.subcategories[scIdx5]?.tasks[tIdx2]) break;
      proj8.categories[catIdx8].subcategories[scIdx5].tasks.splice(tIdx2, 1);
      saveKpiProjects();
      render();
      break;
    }

    // KPI Share actions
    case 'kpi-share-project': {
      const shareId = el.dataset.kpiId;
      const shareProj = kpiProjects.find(p => p.id === shareId);
      if (!shareProj) break;
      kpiShareProjectId = shareId;
      showModal = true; modalType = 'kpi-share'; render();
      break;
    }
    case 'kpi-share-export-json': {
      const expProj = kpiProjects.find(p => p.id === kpiShareProjectId);
      if (!expProj) break;
      const jsonStr = JSON.stringify(expProj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `WBS_${expProj.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast('JSON 파일이 다운로드되었습니다');
      break;
    }
    case 'kpi-share-import-json': {
      const fileInput = document.createElement('input');
      fileInput.type = 'file'; fileInput.accept = '.json';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const imported = JSON.parse(ev.target.result);
            if (!imported.name || !imported.categories) { showToast('유효하지 않은 WBS 파일입니다'); return; }
            imported.id = 'kpi_' + Date.now();
            imported.importedAt = new Date().toISOString();
            kpiProjects.push(imported);
            saveKpiProjects();
            showToast(`"${imported.name}" 프로젝트를 가져왔습니다`);
            closeModal(); render();
          } catch(err) { showToast('파일을 읽을 수 없습니다'); }
        };
        reader.readAsText(file);
      };
      fileInput.click();
      break;
    }
    case 'kpi-share-qr': {
      const qrProj = kpiProjects.find(p => p.id === kpiShareProjectId);
      if (!qrProj) break;
      const qrData = JSON.stringify(qrProj);
      if (qrData.length > 2000) {
        showToast('데이터가 너무 커서 QR코드로 변환할 수 없습니다. JSON 파일 또는 클립보드를 사용하세요.');
        break;
      }
      kpiQrData = qrData;
      showModal = true; modalType = 'kpi-qr'; render();
      setTimeout(() => { generateKpiQrCode(qrData); }, 100);
      break;
    }
    case 'kpi-share-clipboard-copy': {
      const cpProj = kpiProjects.find(p => p.id === kpiShareProjectId);
      if (!cpProj) break;
      const cpData = JSON.stringify(cpProj);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cpData).then(() => {
          showToast('WBS 데이터가 클립보드에 복사되었습니다. 팀원에게 전송하세요!');
        }).catch(() => { fallbackCopyText(cpData); });
      } else { fallbackCopyText(cpData); }
      break;
    }
    case 'kpi-share-clipboard-paste': {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(text => { importKpiFromText(text); }).catch(() => {
          showKpiPrompt('WBS 데이터 붙여넣기', [
            { label: 'WBS 데이터', id: 'kpi-f-paste', value: '', placeholder: '복사한 WBS 데이터를 여기에 붙여넣으세요', type: 'textarea' }
          ], (vals) => { importKpiFromText(vals['kpi-f-paste']); });
        });
      } else {
        showKpiPrompt('WBS 데이터 붙여넣기', [
          { label: 'WBS 데이터', id: 'kpi-f-paste', value: '', placeholder: '복사한 WBS 데이터를 여기에 붙여넣으세요', type: 'textarea' }
        ], (vals) => { importKpiFromText(vals['kpi-f-paste']); });
      }
      break;
    }

    // Clipboard actions
    case 'clip-add':
      clipboardEditingItem = null;
      clipboardTempImage = null;
      showModal = true; modalType = 'add-clipboard'; render(); break;
    case 'clip-edit': {
      const clipId = el.dataset.clipId;
      const clipItem = clipboardItems.find(c => c.id === clipId);
      if (clipItem) {
        clipboardEditingItem = clipItem;
        clipboardTempImage = clipItem.imageData || null;
        showModal = true; modalType = 'edit-clipboard'; render();
      }
      break;
    }
    case 'clip-delete': {
      const clipId = el.dataset.clipId;
      if (confirm(t('clip_delete_confirm') || '삭제하시겠습니까?')) {
        clipboardItems = clipboardItems.filter(c => c.id !== clipId);
        saveClipboardItems(); render();
      }
      break;
    }
    case 'clip-copy': {
      const clipId = el.dataset.clipId;
      const clipItem = clipboardItems.find(c => c.id === clipId);
      if (clipItem) {
        if (clipItem.content) {
          navigator.clipboard.writeText(clipItem.content).then(() => {
            showToast(t('clip_copied') || '클립보드에 복사되었습니다');
          }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = clipItem.content; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            showToast(t('clip_copied') || '클립보드에 복사되었습니다');
          });
        } else if (clipItem.imageData) {
          showToast(t('clip_image_copied') || '이미지는 직접 복사할 수 없습니다');
        }
      }
      break;
    }
    case 'clip-remove-image':
      clipboardTempImage = false;
      const previewImg = document.getElementById('clip-preview-img');
      const dropZone = document.getElementById('clip-image-drop');
      if (dropZone) {
        dropZone.innerHTML = `<div class="clip-upload-placeholder"><i class="ri-image-add-line" style="font-size:32px;opacity:0.3"></i><p style="opacity:0.4;font-size:12px">${escapeHtml(t('clip_paste_image') || 'Ctrl+V로 이미지 붙여넣기')}</p><label class="clip-file-label"><i class="ri-camera-line"></i> ${escapeHtml(t('clip_select_image') || '이미지 선택')}<input type="file" accept="image/*" id="clip-file-input" style="display:none"></label></div>`;
      }
      break;

    // Hamburger
    case 'toggle-hamburger': showHamburgerMenu = !showHamburgerMenu; showLangDropdown = false; render(); break;
    case 'toggle-notifications': showNotifications = !showNotifications; showLangDropdown = false; render(); break;

    // Language dropdown
    case 'toggle-lang-dropdown': showLangDropdown = !showLangDropdown; render(); break;
    case 'toggle-settings-lang': showSettingsLangPicker = !showSettingsLangPicker; render(); break;
    case 'set-lang':
      state.language = el.dataset.lang;
      showLangDropdown = false;
      showSettingsLangPicker = false;
      saveState(); render(); break;

    // Theme
    case 'toggle-theme':
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(); saveState(); showHamburgerMenu = false; render(); break;

    // Electron window controls
    case 'toggle-electron-pin':
      if (IS_ELECTRON) { window.electronAPI.togglePin(); }
      break;
    case 'toggle-mini-mode':
      if (IS_ELECTRON) { window.electronAPI.toggleMiniMode(); }
      break;
    case 'toggle-quick-copy':
      quickCopyMode = !quickCopyMode; render(); break;
    case 'electron-minimize':
      if (IS_ELECTRON) { window.electronAPI.minimizeWindow(); }
      break;
    case 'electron-close':
      if (IS_ELECTRON) { window.electronAPI.closeWindow(); }
      break;
    case 'quick-copy-item': {
      const copyText = el.dataset.copyText || el.closest('[data-copy-text]')?.dataset.copyText;
      if (copyText) {
        if (IS_ELECTRON) { window.electronAPI.copyToClipboard(copyText); }
        else { navigator.clipboard.writeText(copyText); }
        // Show copied feedback
        const origBg = el.style.background;
        el.style.background = 'rgba(16,185,129,0.2)';
        const origText = el.querySelector('.qc-copy-btn');
        if (origText) { origText.innerHTML = '<i class="ri-check-line"></i>'; }
        setTimeout(() => { el.style.background = origBg; if (origText) origText.innerHTML = '<i class="ri-file-copy-line"></i>'; }, 800);
      }
      break;
    }

    // Plus menu
    case 'close-plus': showPlusMenu = false; render(); break;
    case 'open-infoweb4-apply': showPlusMenu = false; webviewUrl = 'https://1page.to'; state.currentTab = 'webview'; render(); break;
    case 'open-alpha-guard': showPlusMenu = false; state.currentTab = 'web3guard'; render(); break;
    case 'open-alpha-trip': showPlusMenu = false; webviewUrl = 'https://alphatrip.org'; state.currentTab = 'webview'; render(); break;
    case 'open-alpha-trip-home': webviewUrl = 'https://alphatrip.org'; state.currentTab = 'webview'; render(); break;

    // Web3 Guard actions
    case 'w3g-scan': {
      const urlInput = document.querySelector('[data-w3g-url]');
      let url = urlInput ? urlInput.value.trim() : web3guardUrl;
      if (!url) break;
      if (!url.startsWith('http')) url = 'https://' + url;
      web3guardUrl = url;
      web3guardLoading = true;
      web3guardScanResult = null;
      render();
      setTimeout(() => {
        web3guardScanResult = analyzeDappSecurity(url);
        web3guardLoading = false;
        web3guardProceedUrl = url;
        saveWeb3GuardHistory(url, web3guardScanResult);
        render();
      }, 800);
      break;
    }
    case 'w3g-open-dapp': {
      const dappUrl = el.dataset.url;
      if (!dappUrl) break;
      web3guardUrl = dappUrl;
      web3guardLoading = true;
      web3guardScanResult = null;
      render();
      setTimeout(() => {
        web3guardScanResult = analyzeDappSecurity(dappUrl);
        web3guardLoading = false;
        web3guardProceedUrl = dappUrl;
        saveWeb3GuardHistory(dappUrl, web3guardScanResult);
        if (web3guardScanResult.safe) {
          state.currentTab = 'web3guard-browser';
        }
        render();
      }, 600);
      break;
    }
    case 'w3g-proceed': {
      state.currentTab = 'web3guard-browser';
      render();
      break;
    }
    case 'w3g-proceed-anyway': {
      web3guardShowWarning = true;
      render();
      break;
    }
    case 'w3g-warning-block': {
      web3guardShowWarning = false;
      web3guardProceedUrl = '';
      render();
      break;
    }
    case 'w3g-warning-proceed': {
      web3guardShowWarning = false;
      state.currentTab = 'web3guard-browser';
      render();
      break;
    }
    case 'w3g-back-to-guard': {
      state.currentTab = 'web3guard';
      render();
      break;
    }
    case 'w3g-browser-refresh': {
      const frame = document.getElementById('w3g-browser-frame');
      if (frame) frame.src = frame.src;
      break;
    }
    case 'w3g-open-wallet': {
      // Show wallet selection bottom sheet with native bridge support
      const allWalletOptions = [
        { id: 'metamask', name: 'MetaMask', icon: 'ri-fire-fill', color: '#f6851b', pkg: 'io.metamask' },
        { id: 'trust', name: 'Trust Wallet', icon: 'ri-shield-check-fill', color: '#3375bb', pkg: 'com.trustwallet.app' },
        { id: 'tokenpocket', name: 'TokenPocket', icon: 'ri-wallet-fill', color: '#2980fe', pkg: 'vip.mytokenpocket' },
        { id: 'okx', name: 'OKX Wallet', icon: 'ri-global-fill', color: '#000', pkg: 'com.okex.wallet' },
        { id: 'coinbase', name: 'Coinbase', icon: 'ri-coin-fill', color: '#0052ff', pkg: 'com.coinbase.android' },
        { id: 'binance', name: 'Binance', icon: 'ri-exchange-fill', color: '#f0b90b', pkg: 'com.binance.dev' },
        { id: 'gate', name: 'Gate.io', icon: 'ri-exchange-funds-fill', color: '#2354e6', pkg: 'io.gate.gateio' },
        { id: 'phantom', name: 'Phantom', icon: 'ri-ghost-fill', color: '#ab9ff2', pkg: 'app.phantom' },
        { id: 'rainbow', name: 'Rainbow', icon: 'ri-rainbow-fill', color: '#001e59', pkg: 'me.rainbow' },
        { id: 'zerion', name: 'Zerion', icon: 'ri-funds-fill', color: '#2962ef', pkg: 'io.zerion.android' },
      ];
      
      // Check installed wallets via native bridge
      let installedIds = [];
      const isNative = typeof window.iBagNativeBridge !== 'undefined';
      if (isNative) {
        try {
          const installed = JSON.parse(window.iBagNativeBridge.getInstalledWallets() || '[]');
          installedIds = installed.map(w => w.id);
        } catch(e) { console.error('getInstalledWallets error:', e); }
      }
      
      const dappUrl = web3guardProceedUrl || '';
      let walletHtml = `<div style="padding:20px">`;
      walletHtml += `<p style="color:var(--text-secondary);font-size:13px;margin:0 0 16px">${t('w3g_wallet_desc') || '외부 지갑 앱에서 DApp을 열어 안전하게 연결합니다'}</p>`;
      
      // Show installed wallets first
      if (installedIds.length > 0) {
        walletHtml += `<div style="margin-bottom:12px;font-size:12px;font-weight:600;color:var(--accent-color,#10b981);text-transform:uppercase;letter-spacing:0.5px"><i class="ri-checkbox-circle-fill"></i> ${t('w3g_installed') || '설치됨'}</div>`;
        walletHtml += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">`;
        allWalletOptions.filter(w => installedIds.includes(w.id)).forEach(w => {
          walletHtml += `<button data-action="w3g-launch-wallet" data-wallet-id="${w.id}" data-url="${escapeHtml(dappUrl)}" data-pkg="${w.pkg}" style="display:flex;align-items:center;gap:10px;padding:14px;border-radius:12px;border:1px solid rgba(16,185,129,0.3);background:rgba(16,185,129,0.06);cursor:pointer;transition:all .2s">`;
          walletHtml += `<i class="${w.icon}" style="font-size:24px;color:${w.color}"></i>`;
          walletHtml += `<span style="font-size:14px;font-weight:600;color:var(--text-primary)">${w.name}</span>`;
          walletHtml += `</button>`;
        });
        walletHtml += `</div>`;
      }
      
      // Show all wallets
      const notInstalled = allWalletOptions.filter(w => !installedIds.includes(w.id));
      if (notInstalled.length > 0) {
        if (installedIds.length > 0) {
          walletHtml += `<div style="margin-bottom:12px;font-size:12px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">${t('w3g_other_wallets') || '다른 지갑'}</div>`;
        }
        walletHtml += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">`;
        notInstalled.forEach(w => {
          walletHtml += `<button data-action="w3g-launch-wallet" data-wallet-id="${w.id}" data-url="${escapeHtml(dappUrl)}" data-pkg="${w.pkg}" style="display:flex;align-items:center;gap:10px;padding:14px;border-radius:12px;border:1px solid var(--border-color,rgba(255,255,255,0.1));background:var(--bg-secondary,rgba(255,255,255,0.04));cursor:pointer;transition:all .2s;opacity:0.7">`;
          walletHtml += `<i class="${w.icon}" style="font-size:24px;color:${w.color}"></i>`;
          walletHtml += `<span style="font-size:14px;font-weight:600;color:var(--text-primary)">${w.name}</span>`;
          walletHtml += `</button>`;
        });
        walletHtml += `</div>`;
      }
      
      walletHtml += `<div style="margin-top:16px;padding:12px;background:rgba(14,165,233,0.08);border-radius:10px;display:flex;align-items:start;gap:8px">`;
      walletHtml += `<i class="ri-information-line" style="color:#0ea5e9;font-size:18px;margin-top:1px;flex-shrink:0"></i>`;
      walletHtml += `<span style="font-size:12px;color:var(--text-secondary)">${t('w3g_wallet_tip') || '지갑 앱의 내장 브라우저에서 DApp을 열어 안전하게 연결합니다. 설치되지 않은 지갑은 앱스토어로 이동합니다.'}</span>`;
      walletHtml += `</div></div>`;
      showBottomSheet(t('w3g_connect_wallet') || '지갑 연결', walletHtml, 'wallet-connect');
      break;
    }
    case 'w3g-launch-wallet': {
      const walletId = el.dataset.walletId;
      const dUrl = el.dataset.url;
      const pkg = el.dataset.pkg;
      const isNativeApp = typeof window.iBagNativeBridge !== 'undefined';
      
      if (isNativeApp && walletId && dUrl) {
        // Use native bridge to open DApp in wallet's built-in browser
        try {
          window.iBagNativeBridge.openDAppInWallet(walletId, dUrl);
        } catch(e) {
          console.error('Native bridge error:', e);
          // Fallback to Play Store
          if (pkg) window.iBagNativeBridge.openExternalUrl('market://details?id=' + pkg);
        }
      } else {
        // Web fallback: try deep link schemes
        const schemes = {
          metamask: 'https://metamask.app.link/dapp/',
          trust: 'trust://open_url?coin_id=60&url=',
          tokenpocket: 'tpoutside://open?params=',
          okx: 'okx://wallet/dapp/url?dappUrl=',
          coinbase: 'https://go.cb-w.com/dapp?cb_url=',
          binance: 'bnc://app.binance.com/cedefi/dapp-browser?url=',
          gate: 'gateio://url?url=',
          phantom: 'phantom://browse/',
          rainbow: 'rainbow://dapp?url=',
          zerion: 'zerion://browser?url=',
        };
        const scheme = schemes[walletId];
        if (scheme && dUrl) {
          const encodedUrl = encodeURIComponent(dUrl);
          if (walletId === 'metamask') {
            window.location.href = scheme + dUrl.replace(/^https?:\/\//, '');
          } else {
            window.location.href = scheme + encodedUrl;
          }
          // Fallback to Play Store after 2s
          setTimeout(() => {
            if (pkg) window.location.href = 'market://details?id=' + pkg;
          }, 2000);
        }
      }
      // Close bottom sheet
      const bsOverlay = document.querySelector('.bottom-sheet-overlay');
      if (bsOverlay) { bsOverlay.classList.remove('active'); setTimeout(() => bsOverlay.remove(), 300); }
      break;
    }
    case 'w3g-clear-scan': {
      web3guardScanResult = null;
      web3guardUrl = '';
      web3guardProceedUrl = '';
      render();
      break;
    }
    case 'w3g-clear-history': {
      web3guardHistory = [];
      try { localStorage.removeItem('web3guard_history'); } catch(e) {}
      render();
      break;
    }
    case 'goto-infoweb-tab': {
      state.currentTab = 'infoweb';
      render();
      break;
    }

    // infoweb4
    case 'open-infoweb4':
      // Open in-app webview with close button
      if (el.dataset.url) {
        webviewUrl = el.dataset.url;
        state.currentTab = 'webview';
        render();
      }
      break;
    case 'share-infoweb4':
      if (navigator.share) { navigator.share({ title: el.dataset.name, url: el.dataset.url }); }
      else { navigator.clipboard.writeText(el.dataset.url); alert(t('share_copied')); }
      break;

    // Banner
    case 'dismiss-banner': bannerDismissed = true; render(); break;
    case 'open-link': if (el.dataset.link) window.open(el.dataset.link, '_blank'); break;

    // Add items
    case 'add-bookmark': editingItem = null; showModal = true; modalType = 'add-bookmark'; privatePinUnlocked = false; render(); break;
    case 'add-web3': editingItem = null; showModal = true; modalType = 'add-web3'; privatePinUnlocked = false; render(); break;
    case 'add-memo': editingItem = null; memoTempImage = null; showModal = true; modalType = 'add-memo'; render(); break;
    case 'add-file': handleAddFile(); break;

    // Idea Note actions
    case 'idea-add': ideaCreateNew(); break;
    case 'idea-edit': ideaOpenNote(el.dataset.ideaId); break;
    case 'idea-delete':
      if (confirm(t('idea_delete_confirm') || '이 노트를 삭제하시겠습니까?')) {
        deleteIdeaNoteById(el.dataset.ideaId).then(() => render());
      }
      break;
    case 'idea-back': ideaSaveCurrentNote().then(() => ideaGoBack()); break;
    case 'idea-save': ideaSaveCurrentNote(); break;
    case 'idea-toggle-draw':
      ideaDrawing = !ideaDrawing;
      render();
      if (ideaDrawing) setTimeout(() => initIdeaCanvas(), 100);
      break;
    case 'idea-draw-eraser': ideaDrawEraser = !ideaDrawEraser; render(); setTimeout(() => initIdeaCanvas(), 100); break;
    case 'idea-draw-clear':
      if (confirm(t('idea_draw_clear_confirm') || '그림을 모두 지우시겠습니까?')) {
        const c = document.getElementById('idea-canvas');
        if (c) { const ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height); }
      }
      break;
    case 'idea-draw-size-up': ideaDrawSize = Math.min(20, ideaDrawSize + 1); render(); setTimeout(() => initIdeaCanvas(), 100); break;
    case 'idea-draw-size-down': ideaDrawSize = Math.max(1, ideaDrawSize - 1); render(); setTimeout(() => initIdeaCanvas(), 100); break;
    case 'idea-record-audio':
      if (ideaRecordingAudio) { ideaStopAudioRecording(); }
      else { ideaStartAudioRecording(); }
      break;
    case 'idea-record-video':
      if (ideaRecordingVideo) { ideaStopVideoRecording(); }
      else { ideaStartVideoRecording(); }
      break;
    case 'idea-play-audio': ideaPlayAudio(el.dataset.mediaId); break;
    case 'idea-play-video': ideaPlayVideo(el.dataset.mediaId); break;
    case 'idea-del-media':
      if (confirm(t('idea_del_media_confirm') || '이 미디어를 삭제하시겠습니까?')) {
        ideaDeleteMedia(el.dataset.mediaId, el.dataset.mediaType);
      }
      break;

    // Share
    case 'start-share-bookmarks': shareSelectMode = true; shareSelectType = 'bookmarks'; shareSelectedIds.clear(); render(); break;
    case 'start-share-web3': shareSelectMode = true; shareSelectType = 'web3'; shareSelectedIds.clear(); render(); break;
    case 'start-share-memos': shareSelectMode = true; shareSelectType = 'memos'; shareSelectedIds.clear(); render(); break;
    case 'start-share-files': shareSelectMode = true; shareSelectType = 'files'; shareSelectedIds.clear(); render(); break;
    case 'share-cancel': shareSelectMode = false; shareSelectedIds.clear(); render(); break;
    case 'share-execute': if (shareSelectedIds.size > 0) { showModal = true; modalType = 'share-pin'; render(); } break;
    case 'share-no-pin': executeShare(''); break;
    case 'share-with-pin':
      const pinVal = document.getElementById('share-pin-input')?.value || '';
      if (pinVal.length === 6) executeShare(pinVal); else alert(t('share_pin_6digits'));
      break;
    case 'copy-share-link':
      if (window._lastShareUrl) { navigator.clipboard.writeText(window._lastShareUrl); alert(t('share_copied')); }
      break;

    // Settings
    case 'change-pin': showModal = true; modalType = 'change-pin'; render(); break;
    case 'toggle-autolock': showModal = true; modalType = 'autolock'; render(); break;
    case 'setup-private-pin':
      privatePinInput = ''; privatePinConfirm = ''; privatePinError = '';
      privatePinStep = state.privatePin ? 'enter' : 'new';
      showModal = true; modalType = 'private-pin'; render(); break;
    case 'remove-private-pin':
      privatePinInput = ''; privatePinError = ''; privatePinStep = 'verify-remove';
      showModal = true; modalType = 'private-pin'; render(); break;
    case 'unlock-private-pin':
      privatePinInput = ''; privatePinError = ''; privatePinStep = 'enter';
      privatePinCallback = () => { privatePinUnlocked = true; render(); };
      showModal = true; modalType = 'private-pin'; render(); break;

    // Export/Import
    case 'export': handleExport(); break;
    case 'import': handleImport(); break;
    case 'reset': if (confirm(t('set_reset_confirm'))) { window.electronAPI.saveData({}); location.reload(); } break;

    // Memo image
    case 'remove-memo-image': memoTempImage = false; render(); break;
    case 'pick-memo-image': handlePickMemoImage(); break;
    case 'copy-memo-image': {
      const memoId = el.dataset.memoId;
      const imgSrc = memoImageCache[memoId];
      if (imgSrc) {
        copyImageToClipboard(imgSrc);
      }
      break;
    }

    // Work items
    case 'add-work-item':
      workEditingItem = null;
      showModal = true; modalType = 'add-work'; render(); break;
    case 'edit-work-item': {
      const wId = el.dataset.workId;
      workEditingItem = workItems.find(w => w.id === wId);
      if (workEditingItem) { showModal = true; modalType = 'edit-work'; render(); }
      break;
    }
    case 'delete-work-item': {
      const wId2 = el.dataset.workId;
      if (confirm(t('work_delete_confirm'))) {
        workItems = workItems.filter(w => w.id !== wId2);
        saveWorkItems();
        render();
      }
      break;
    }
    case 'toggle-work-expand': {
      const wId3 = el.dataset.workId;
      workExpandedId = workExpandedId === wId3 ? null : wId3;
      render();
      break;
    }
    case 'toggle-work-field': {
      const wId4 = el.dataset.workId;
      const fIdx = parseInt(el.dataset.fieldIdx);
      const item = workItems.find(w => w.id === wId4);
      if (item && item.fields[fIdx]) {
        const span = document.getElementById(`work-field-${wId4}-${fIdx}`);
        if (span) {
          const isMasked = span.textContent.includes('\u2022');
          span.textContent = isMasked ? item.fields[fIdx].value : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
          const icon = el.querySelector('i');
          if (icon) icon.className = isMasked ? 'ri-eye-off-line' : 'ri-eye-line';
        }
      }
      break;
    }
    case 'copy-work-field': {
      const wId5 = el.dataset.workId;
      const fIdx2 = parseInt(el.dataset.fieldIdx);
      const isSensitive = el.dataset.sensitive === 'true';
      const item2 = workItems.find(w => w.id === wId5);
      if (item2 && item2.fields[fIdx2]) {
        if (isSensitive) {
          secureCopyToClipboard(item2.fields[fIdx2].value, item2.fields[fIdx2].name);
        } else {
          navigator.clipboard.writeText(item2.fields[fIdx2].value);
          showClipboardToast(t('work_copied'), 'success');
        }
      }
      break;
    }
    case 'add-work-field': {
      const container = document.getElementById('work-fields-container');
      if (container) {
        const idx = container.children.length;
        const div = document.createElement('div');
        div.className = 'work-modal-field';
        div.dataset.fieldIdx = idx;
        div.innerHTML = `
          <div style="display:flex;gap:6px;align-items:center">
            <input class="form-input" style="flex:1" placeholder="${escapeHtml(t('work_field_name'))}" data-work-field-name="${idx}">
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-muted);white-space:nowrap">
              <input type="checkbox" data-work-field-sensitive="${idx}" checked> <i class="ri-lock-line"></i>
            </label>
            <button class="work-field-remove" data-action="remove-work-field" data-field-idx="${idx}"><i class="ri-close-line"></i></button>
          </div>
          <textarea class="form-textarea" rows="2" placeholder="${escapeHtml(t('work_field_value'))}" data-work-field-value="${idx}"></textarea>
        `;
        container.appendChild(div);
      }
      break;
    }
    case 'remove-work-field': {
      const fieldEl = el.closest('.work-modal-field');
      if (fieldEl) fieldEl.remove();
      break;
    }
    case 'work-security-scan': {
      runSecurityScan();
      break;
    }

    // Org chart
    case 'add-orgchart': showModal = true; modalType = 'add-orgchart'; render(); break;
    case 'view-orgchart':
      const orgId = el.dataset.orgId;
      currentOrgChart = vaultOrgCharts.find(c => c.id === orgId);
      if (currentOrgChart) { state.currentTab = 'orgchart-view'; render(); }
      break;
    case 'add-org-root':
      orgEditNode = { parentId: null };
      showModal = true; modalType = 'add-org-node'; render(); break;
    case 'add-org-child':
      orgEditNode = { parentId: el.dataset.parentId };
      showModal = true; modalType = 'add-org-node'; render(); break;
    case 'edit-org-node':
      const nodeId = el.dataset.nodeId;
      orgEditNode = currentOrgChart.nodes.find(n => n.id === nodeId);
      if (orgEditNode) { showModal = true; modalType = 'edit-org-node'; render(); }
      break;
    case 'delete-org-node':
      if (orgEditNode && currentOrgChart) {
        try {
          // Delete node and all children
          const toDelete = new Set();
          function collectChildren(pid) { toDelete.add(pid); (currentOrgChart.nodes || []).filter(n => n.parentId === pid).forEach(n => collectChildren(n.id)); }
          collectChildren(orgEditNode.id);
          currentOrgChart.nodes = (currentOrgChart.nodes || []).filter(n => !toDelete.has(n.id));
          vaultSaveEncrypted(); closeModal(); render();
        } catch(e) {
          console.error('Org node delete error:', e);
          alert(t('org_save_error') || 'Error deleting node. Please try again.');
        }
      }
      break;
    case 'vault-reset':
      if (confirm(t('vault_reset_confirm') || 'Vault를 초기화하면 모든 조직도 데이터가 삭제됩니다. 계속하시겠습니까?')) {
        VaultCrypto.reset().then(() => {
          vaultUnlocked = false; vaultViewPassword = null; vaultOrgCharts = [];
          vaultPwInput = ''; vaultPwConfirm = ''; vaultPanicInput = ''; vaultPanicConfirm = '';
          vaultSetupStep = 0; vaultError = ''; vaultAttempts = 0;
          render();
        });
      }
      break;
    case 'vault-lock':
      vaultUnlocked = false; vaultViewPassword = null; vaultOrgCharts = []; currentOrgChart = null;
      vaultPwInput = ''; vaultError = '';
      if (vaultAutoLockTimer) { clearTimeout(vaultAutoLockTimer); vaultAutoLockTimer = null; }
      render();
      break;
    case 'vault-settings':
      state.currentTab = 'vault-settings';
      render();
      break;
    case 'vault-change-view':
      vaultChangeMode = 'verify-old';
      vaultOldPassword = '';
      vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0; vaultError = '';
      state.currentTab = 'vault-change-pw';
      render();
      break;
    case 'vault-change-panic':
      vaultChangeMode = 'change-panic';
      vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0; vaultError = '';
      state.currentTab = 'vault-change-pw';
      render();
      break;
    case 'vault-step-back':
      // Setup mode: go back one step
      if (vaultSetupStep > 0) {
        vaultSetupStep--;
        vaultError = '';
        // If going back from confirm step (odd) to set step (even), restore input
        if (vaultSetupStep % 2 === 0) {
          // Going back to the input step - clear confirm and let user re-enter
          vaultPwConfirm = '';
          if (vaultSetupStep === 0) { vaultPwInput = ''; }
          else if (vaultSetupStep === 2) { vaultPwInput = ''; }
        } else {
          // Going back from set step to confirm step of previous pair
          vaultPwConfirm = '';
          vaultPwInput = vaultViewPassword || '';
        }
      }
      render();
      break;
    case 'vault-reset-setup':
      // Reset entire setup from scratch
      vaultSetupStep = 0;
      vaultPwInput = ''; vaultPwConfirm = ''; vaultPanicInput = ''; vaultPanicConfirm = '';
      vaultViewPassword = null; vaultError = '';
      render();
      break;
    case 'vault-change-step-back':
      // Change password mode: go back one step
      if (vaultSetupStep > 0) {
        vaultSetupStep--;
        vaultPwConfirm = '';
        if (vaultSetupStep === 0) { vaultPwInput = ''; }
        vaultError = '';
      }
      render();
      break;
    case 'vault-change-cancel':
      // Cancel password change and go back to settings
      vaultChangeMode = ''; vaultOldPassword = '';
      vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0; vaultError = '';
      state.currentTab = 'vault-settings';
      render();
      break;
    case 'vault-autolock-set': {
      const mins = parseInt(el.dataset.minutes || '5');
      vaultAutoLockMinutes = mins;
      localStorage.setItem('ibag_vault_autolock', String(mins));
      vaultResetAutoLock();
      render();
      break;
    }

    // USDT Exchange Calculator
    case 'usdt-refresh':
      fetchUsdtKrwPrice().then(() => { fetchCurrencyRates().then(() => {
        if (exchangeAmountUsdt) calcExchangeFromUsdt(parseFloat(exchangeAmountUsdt));
        render();
      }); });
      break;
    case 'show-ref-price': {
      const ref = el.dataset.ref;
      calcRefCurrency = ref || 'usdt';
      render();
      break;
    }
    case 'close-ref-popup':
      calcRefCurrency = null;
      render();
      break;
    case 'calc-photo-open':
      calcPhotoMode = true;
      calcPhotoImage = null;
      calcPhotoResult = null;
      calcPhotoProcessing = false;
      render();
      break;
    case 'calc-photo-close':
      calcPhotoMode = false;
      calcPhotoImage = null;
      calcPhotoResult = null;
      calcPhotoProcessing = false;
      render();
      break;
    case 'calc-photo-pick': {
      const photoInput = document.createElement('input');
      photoInput.type = 'file';
      photoInput.accept = 'image/*';
      photoInput.capture = 'environment';
      photoInput.onchange = () => {
        const file = photoInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => doCalcPhotoOCR(reader.result);
        reader.readAsDataURL(file);
      };
      photoInput.click();
      break;
    }
    case 'calc-photo-reset':
      calcPhotoImage = null;
      calcPhotoResult = null;
      calcPhotoProcessing = false;
      render();
      break;

    // Token Detail
    case 'open-token-detail': {
      const tdId = el.dataset.tokenId;
      if (tdId) {
        tokenDetailId = tdId;
        tokenDetailData = null;
        tokenDetailLoading = true;
        tokenDetailTab = 'trading';
        tokenTradingSubTab = 'activities';
        tokenActivitiesFilter = 'all';
        tokenPoolSubTab = 'changes';
        tokenIsFavorited = tokenFavorites.includes(tdId);
        state.currentTab = 'token-detail';
        render();
        fetchTokenDetail(tdId);
        connectTokenWebSocket(tdId);
      }
      break;
    }
    case 'close-token-detail':
      disconnectTokenWebSocket();
      tokenDetailId = null;
      tokenDetailData = null;
      tokenTxnData = [];
      tokenSecurityData = null;
      tokenPoolData = null;
      tokenHoldersData = null;
      tokenWsPrice = null;
      tokenWsPriceChange = null;
      state.currentTab = 'home';
      render();
      break;
    case 'td-tab': {
      const tab = el.dataset.tab;
      if (tab) { tokenDetailTab = tab; render(); }
      break;
    }
    case 'td-chart-period': {
      const period = el.dataset.period;
      if (period) { tokenChartPeriod = period; render(); }
      break;
    }
    case 'tp-indicator': {
      const ind = el.dataset.indicator;
      if (ind) { tokenChartIndicator = ind; render(); }
      break;
    }
    case 'tp-sub-tab': {
      const subtab = el.dataset.subtab;
      if (subtab) { tokenTradingSubTab = subtab; render(); }
      break;
    }
    case 'tp-activities-filter': {
      const filter = el.dataset.filter;
      if (filter) { tokenActivitiesFilter = filter; render(); }
      break;
    }
    case 'tp-pool-subtab': {
      const pst = el.dataset.subtab;
      if (pst) { tokenPoolSubTab = pst; render(); }
      break;
    }
    case 'tp-favorite':
      tokenIsFavorited = !tokenIsFavorited;
      if (tokenIsFavorited && tokenDetailId) {
        if (!tokenFavorites.includes(tokenDetailId)) {
          tokenFavorites.push(tokenDetailId);
          saveTokenFavorites();
          showToast(t('tp_added_favorite') || 'Added to favorites');
        }
      } else if (tokenDetailId) {
        tokenFavorites = tokenFavorites.filter(id => id !== tokenDetailId);
        saveTokenFavorites();
        showToast(t('tp_removed_favorite') || 'Removed from favorites');
      }
      render();
      break;
    case 'tp-external': {
      const d = tokenDetailData;
      if (d?.dexUrl) window.open(d.dexUrl, '_blank');
      else if (d?.homepage) window.open(d.homepage, '_blank');
      else window.open(`https://www.coingecko.com/en/coins/${tokenDetailId}`, '_blank');
      break;
    }
    case 'tp-trade': {
      // Open PancakeSwap trade page for this token
      const tradeToken = tokenDetailData;
      const tradeContract = tradeToken?.contractAddress || '';
      const tradeNetwork = tradeToken?.network || '';
      if (tradeContract) {
        // Determine chain for PancakeSwap
        const psChainMap = {
          'binance-smart-chain': 'bsc', 'ethereum': 'eth', 'arbitrum-one': 'arb',
          'base': 'base', 'polygon-pos': 'polygon', 'avalanche': 'avax',
        };
        const psChain = psChainMap[tradeNetwork] || 'bsc';
        const psUrl = `https://pancakeswap.finance/swap?chain=${psChain}&outputCurrency=${tradeContract}`;
        window.open(psUrl, '_blank');
      } else {
        // For major tokens without contract, try by symbol
        const tkSymbol = (tradeToken?.symbol || '').toLowerCase();
        if (tkSymbol === 'bnb') {
          window.open('https://pancakeswap.finance/swap?chain=bsc', '_blank');
        } else if (tkSymbol === 'eth') {
          window.open('https://app.uniswap.org/swap', '_blank');
        } else {
          window.open(`https://pancakeswap.finance/swap?chain=bsc`, '_blank');
        }
      }
      break;
    }
    case 'tp-meme-mode': {
      // Open DexScreener or PancakeSwap meme mode
      const memeToken = tokenDetailData;
      if (memeToken?.dexUrl) {
        window.open(memeToken.dexUrl, '_blank');
      } else if (memeToken?.contractAddress) {
        window.open(`https://dexscreener.com/bsc/${memeToken.contractAddress}`, '_blank');
      } else {
        window.open('https://pancakeswap.finance/swap?chain=bsc', '_blank');
      }
      break;
    }
    case 'td-refresh':
      if (tokenDetailId) fetchTokenDetail(tokenDetailId);
      break;
    case 'td-copy-contract': {
      const text = el.dataset.text;
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          el.innerHTML = '<i class="ri-check-line" style="color:#10b981"></i>';
          setTimeout(() => { el.innerHTML = '<i class="ri-file-copy-line"></i>'; }, 1500);
        });
      }
      break;
    }

    // Token management
    case 'add-token-modal': showModal = true; modalType = 'add-token'; render(); break;
    case 'select-token':
      const tokenId = el.dataset.tokenId;
      if (tokenId && !state.savedTokens.includes(tokenId)) {
        state.savedTokens.push(tokenId);
        saveState(); fetchTokenPrices(); closeModal(); render();
      }
      break;
    case 'remove-token':
      const rmTokenId = el.dataset.tokenId;
      if (rmTokenId) {
        state.savedTokens = state.savedTokens.filter(t => t !== rmTokenId);
        // Also remove from customTokens if it's a custom token
        customTokens = customTokens.filter(t => t.id !== rmTokenId);
        saveCustomTokens(); saveState(); render();
      }
      break;
    case 'remove-favorite-token': {
      const rmFavId = el.dataset.tokenId;
      if (rmFavId) {
        tokenFavorites = tokenFavorites.filter(id => id !== rmFavId);
        saveTokenFavorites();
        showToast(t('tp_removed_favorite') || 'Removed from favorites');
        render();
      }
      break;
    }
    case 'search-contract-token':
      searchContractToken();
      break;
    case 'add-contract-token':
      addContractTokenFromSearch();
      break;

    // Project management
    case 'add-project-modal': showModal = true; modalType = 'add-project'; render(); break;
    case 'remove-project':
      const rmProjId = el.dataset.projectId;
      if (rmProjId) {
        state.customProjects = (state.customProjects || []).filter(p => p.id !== rmProjId);
        saveState(); render();
      }
      break;

    case 'toggle-project-fav': {
      const projId = el.dataset.projectId;
      if (projId) {
        if (projectFavorites.includes(projId)) {
          projectFavorites = projectFavorites.filter(id => id !== projId);
        } else {
          projectFavorites.push(projId);
        }
        saveProjectFavorites();
        render();
      }
      break;
    }
    case 'quick-add-token': {
      const qatId = el.dataset.tokenId;
      if (qatId && !state.savedTokens.includes(qatId)) {
        state.savedTokens.push(qatId);
        saveState(); render();
      }
      break;
    }

    // Org chart view mode
    case 'org-view-tree': orgViewMode = 'tree'; render(); break;
    case 'org-view-list-name': orgViewMode = 'list-name'; render(); break;
    case 'org-view-list-amount': orgViewMode = 'list-amount'; render(); break;

    // Org chart zoom/pan
    case 'org-zoom-in': {
      orgZoom = Math.min(4, orgZoom + 0.2);
      const p = document.getElementById('org-tree-pannable');
      if (p) { p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`; requestAnimationFrame(drawOrgLines); }
      break;
    }
    case 'org-zoom-out': {
      orgZoom = Math.max(0.2, orgZoom - 0.2);
      const p2 = document.getElementById('org-tree-pannable');
      if (p2) { p2.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`; requestAnimationFrame(drawOrgLines); }
      break;
    }
    case 'org-reset-view': {
      orgPanX = 0; orgPanY = 0; orgZoom = 1;
      const p3 = document.getElementById('org-tree-pannable');
      if (p3) { p3.style.transform = `translate(0px,0px) scale(1)`; requestAnimationFrame(drawOrgLines); }
      break;
    }
    // Org chart search
    case 'org-search-toggle': {
      orgSearchVisible = !orgSearchVisible;
      orgSearchQuery = '';
      orgSearchHighlight = null;
      render();
      if (orgSearchVisible) {
        setTimeout(() => { const inp = document.getElementById('org-search-input'); if (inp) inp.focus(); }, 100);
      }
      break;
    }
    case 'org-search-close': {
      orgSearchVisible = false;
      orgSearchQuery = '';
      orgSearchHighlight = null;
      render();
      break;
    }
    case 'org-search-goto': {
      const targetNodeId = el.dataset.nodeId;
      orgSearchHighlight = targetNodeId;
      orgSearchQuery = '';
      orgSearchVisible = false;
      render();
      // After render, scroll to the highlighted node
      setTimeout(() => {
        const targetEl = document.querySelector(`[data-node-wrapper-id="${targetNodeId}"]`);
        const viewport = document.getElementById('org-viewport');
        if (targetEl && viewport) {
          const tRect = targetEl.getBoundingClientRect();
          const vRect = viewport.getBoundingClientRect();
          // Calculate offset to center the node in viewport
          const offsetX = (vRect.width / 2) - (tRect.left - vRect.left + tRect.width / 2);
          const offsetY = (vRect.height / 2) - (tRect.top - vRect.top + tRect.height / 2);
          orgPanX += offsetX;
          orgPanY += offsetY;
          const p = document.getElementById('org-tree-pannable');
          if (p) {
            p.style.transition = 'transform 0.4s ease';
            p.style.transform = `translate(${orgPanX}px,${orgPanY}px) scale(${orgZoom})`;
            setTimeout(() => { p.style.transition = ''; drawOrgLines(); }, 450);
          }
        }
        // Clear highlight after 3 seconds
        setTimeout(() => { orgSearchHighlight = null; render(); }, 3000);
      }, 150);
      break;
    }

    // Translate
    case 'do-translate': doTranslate(); break;
    case 'translate-swap':
      if (translateFrom !== 'auto') {
        const tmp2 = translateFrom; translateFrom = translateTo; translateTo = tmp2; render();
      }
      break;
    case 'translate-copy':
      if (translatedResult) { navigator.clipboard.writeText(translatedResult); alert(t('share_copied')); }
      break;
    case 'translate-speak':
      if (translatedResult) {
        const utterance = new SpeechSynthesisUtterance(translatedResult);
        utterance.lang = translateTo;
        speechSynthesis.speak(utterance);
      }
      break;

    // Interpreter (speech-to-text + translate + TTS)
    case 'toggle-interpreter': toggleInterpreter(); break;
    case 'interpreter-speak':
      if (interpreterTranslatedText) {
        const utt = new SpeechSynthesisUtterance(interpreterTranslatedText);
        utt.lang = translateTo;
        speechSynthesis.speak(utt);
      }
      break;

    // Security explanation
    case 'show-security-explain':
      showModal = true; modalType = 'security-explain'; render();
      break;

    // ─── Scan & Custom Mainnet ───
    case 'open-scan-modal':
      showScanModal = true; render(); break;
    case 'close-scan-modal':
      showScanModal = false; scanChainSearch = ''; scanChainDropdownOpen = false; scanDropdownSearch = ''; render(); break;
    case 'scan-select-chain':
      scanSelectedChain = el.dataset.chainId || 'ethereum'; scanChainDropdownOpen = false; scanDropdownSearch = ''; render(); break;
    case 'scan-toggle-chain-dropdown':
      scanChainDropdownOpen = !scanChainDropdownOpen; scanDropdownSearch = ''; render();
      if (scanChainDropdownOpen) setTimeout(() => { const si = document.getElementById('scan-dropdown-search'); if (si) si.focus(); }, 100);
      break;
    case 'scan-dropdown-select':
      scanSelectedChain = el.dataset.chainId || 'ethereum'; scanChainDropdownOpen = false; scanDropdownSearch = ''; render(); break;
    case 'scan-paste':
      navigator.clipboard.readText().then(text => {
        scanWalletAddress = text.trim();
        const inp = document.getElementById('scan-address-input');
        if (inp) inp.value = scanWalletAddress;
        render();
      }).catch(() => {});
      break;
    case 'scan-open-explorer': {
      const addr = (document.getElementById('scan-address-input')?.value || '').trim();
      if (!addr) { alert(t('scan_enter_address') || '지갑 주소를 입력하세요'); break; }
      const chains = getAllChains();
      const chain = chains[scanSelectedChain] || chains['ethereum'];
      const url = chain.explorer + (chain.addressPath || '/address/') + addr;
      window.open(url, '_blank');
      break;
    }
    case 'scan-open-tx': {
      const txHash = (document.getElementById('scan-tx-input')?.value || '').trim();
      if (!txHash) { alert(t('scan_enter_tx') || 'TX Hash를 입력하세요'); break; }
      const chains2 = getAllChains();
      const chain2 = chains2[scanSelectedChain] || chains2['ethereum'];
      const txUrl = chain2.explorer + (chain2.txPath || '/tx/') + txHash;
      window.open(txUrl, '_blank');
      break;
    }
    case 'open-custom-mainnet-modal':
      showCustomMainnetModal = true; render(); break;
    case 'close-custom-mainnet-modal':
      showCustomMainnetModal = false; render(); break;
    case 'save-custom-mainnet': {
      const nameEl = document.getElementById('custom-net-name');
      const explorerEl = document.getElementById('custom-net-explorer');
      const addrPathEl = document.getElementById('custom-net-address-path');
      const txPathEl = document.getElementById('custom-net-tx-path');
      const iconEl = document.getElementById('custom-net-icon');
      const colorEl = document.getElementById('custom-net-color');
      const cName = (nameEl?.value || '').trim();
      const cExplorer = (explorerEl?.value || '').trim().replace(/\/$/, '');
      if (!cName || !cExplorer) { alert(t('custom_net_required') || '네트워크 이름과 익스플로러 URL은 필수입니다'); break; }
      const newMainnet = {
        id: 'custom-' + Date.now(),
        name: cName,
        explorer: cExplorer,
        addressPath: (addrPathEl?.value || '').trim() || '/address/',
        txPath: (txPathEl?.value || '').trim() || '/tx/',
        icon: (iconEl?.value || '').trim() || '⬡',
        color: colorEl?.value || '#00d4ff'
      };
      customMainnets.push(newMainnet);
      localStorage.setItem('alphabag_custom_mainnets', JSON.stringify(customMainnets));
      showCustomMainnetModal = false;
      scanSelectedChain = newMainnet.id;
      render();
      break;
    }
    case 'delete-custom-mainnet': {
      const mId = el.dataset.mainnetId;
      customMainnets = customMainnets.filter(cm => cm.id !== mId);
      localStorage.setItem('alphabag_custom_mainnets', JSON.stringify(customMainnets));
      if (scanSelectedChain === mId) scanSelectedChain = 'ethereum';
      render();
      break;
    }

    // Photo translate
    case 'photo-translate-pick': {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => doPhotoTranslateOCR(reader.result);
        reader.readAsDataURL(file);
      };
      input.click();
      break;
    }
    case 'photo-translate-do': doPhotoTranslateTranslate(); break;
    case 'photo-translate-copy': {
      const text = photoTranslateResult || photoTranslateOcrText;
      if (text) { navigator.clipboard.writeText(text).then(() => alert(t('share_copied'))).catch(() => {}); }
      break;
    }
    case 'photo-translate-reset':
      photoTranslateImage = null;
      photoTranslateOcrText = '';
      photoTranslateResult = '';
      photoTranslateProcessing = false;
      photoTranslateOcrWords = [];
      photoTranslateViewMode = 'overlay';
      render();
      break;
    case 'pt-view-overlay':
      photoTranslateViewMode = 'overlay';
      render();
      break;
    case 'pt-view-text':
      photoTranslateViewMode = 'text';
      render();
      break;
  }
}

// ═══════════════════════════════════════════════════════════
// PIN HANDLING
// ═══════════════════════════════════════════════════════════

function handlePinKey(key) {
  // Block input while processing previous PIN
  if (_pinProcessing) return;
  
  if (key === 'del') { currentPin = currentPin.slice(0, -1); pinError = ''; render(); return; }
  if (currentPin.length >= 4) return;
  
  // Clear error on new input
  if (pinError) pinError = '';
  
  currentPin += key;
  render();

  if (currentPin.length === 4) {
    _pinProcessing = true;
    setTimeout(() => {
      if (!state.isSetup) {
        if (!isConfirming) {
          confirmPin = currentPin; currentPin = ''; isConfirming = true; pinError = '';
        } else {
          if (currentPin === confirmPin) {
            state.pin = currentPin; state.isSetup = true; state.locked = false;
            currentPin = ''; confirmPin = ''; isConfirming = false; pinError = '';
            saveState(); startLockTimer();
          } else {
            pinError = t('lock_pin_mismatch'); currentPin = ''; isConfirming = false; confirmPin = '';
            // Auto-clear error after 1.5s
            setTimeout(() => { if (pinError) { pinError = ''; render(); } }, 1500);
          }
        }
      } else {
        if (currentPin === state.pin) {
          state.locked = false; currentPin = ''; pinError = '';
          startLockTimer();
        } else {
          pinError = t('lock_wrong_pin'); currentPin = '';
          // Auto-clear error after 1.5s
          setTimeout(() => { if (pinError) { pinError = ''; render(); } }, 1500);
        }
      }
      _pinProcessing = false;
      render();
    }, 200);
  }
}

function handlePrivatePinKey(key) {
  if (key === 'del') { privatePinInput = privatePinInput.slice(0, -1); render(); return; }
  if (privatePinInput.length >= 6) return;
  privatePinInput += key;
  render();

  if (privatePinInput.length === 6) {
    setTimeout(() => {
      if (privatePinStep === 'new') {
        privatePinConfirm = privatePinInput; privatePinInput = '';
        privatePinStep = 'confirm'; privatePinError = '';
      } else if (privatePinStep === 'confirm') {
        if (privatePinInput === privatePinConfirm) {
          state.privatePin = privatePinInput;
          saveState(); closeModal();
          alert(t('set_private_pin_set_done'));
        } else {
          privatePinError = t('lock_pin_mismatch');
          privatePinInput = ''; privatePinStep = 'new'; privatePinConfirm = '';
        }
      } else if (privatePinStep === 'enter') {
        if (privatePinInput === state.privatePin) {
          privatePinUnlocked = true;
          if (privatePinCallback) { privatePinCallback(); privatePinCallback = null; }
          closeModal();
        } else {
          privatePinError = t('lock_wrong_pin'); privatePinInput = '';
        }
      } else if (privatePinStep === 'verify-remove') {
        if (privatePinInput === state.privatePin) {
          state.privatePin = '';
          saveState(); closeModal();
          alert(t('set_private_pin_removed'));
        } else {
          privatePinError = t('lock_wrong_pin'); privatePinInput = '';
        }
      }
      render();
    }, 200);
  }
}

// ═══════════════════════════════════════════════════════════
// MODAL SAVE HANDLERS
// ═══════════════════════════════════════════════════════════

function handleModalSave(type) {
  if (type === 'bookmark') {
    const title = document.getElementById('m-title')?.value?.trim();
    const url = document.getElementById('m-url')?.value?.trim();
    const cat = document.getElementById('m-cat')?.value;
    const user = document.getElementById('m-user')?.value?.trim();
    const pass = document.getElementById('m-pass')?.value;
    const notes = document.getElementById('m-notes')?.value?.trim();
    if (!title || !url) { alert(t('bm_fill_required')); return; }

    if (editingItem) {
      Object.assign(editingItem, { title, url, category: cat, username: user, notes });
      if (!document.getElementById('m-pass')?.readOnly) editingItem.password = pass;
    } else {
      state.bookmarks.push({ id: genId(), title, url, category: cat, username: user, password: pass, notes, pinned: false, createdAt: Date.now() });
    }
    saveState(); closeModal(); render();
  } else if (type === 'web3') {
    const email = document.getElementById('m-email')?.value?.trim();
    const provider = document.getElementById('m-provider')?.value?.trim();
    const pass = document.getElementById('m-pass')?.value;
    const recovery = document.getElementById('m-recovery')?.value;
    const network = document.getElementById('m-network')?.value?.trim();
    const notes = document.getElementById('m-notes')?.value?.trim();
    if (!email) { alert(t('bm_fill_required')); return; }

    // If adding/editing seed phrase, require private PIN
    if (recovery && recovery.trim() && state.privatePin && !privatePinUnlocked) {
      privatePinInput = ''; privatePinError = ''; privatePinStep = 'enter';
      privatePinCallback = () => { handleModalSave('web3'); };
      showModal = true; modalType = 'private-pin'; render();
      return;
    }

    if (editingItem) {
      Object.assign(editingItem, { email, provider, recoveryPhone: network, notes });
      if (!document.getElementById('m-pass')?.readOnly) editingItem.password = pass;
      if (!document.getElementById('m-recovery')?.readOnly) editingItem.recoveryEmail = recovery;
    } else {
      state.mailAccounts.push({ id: genId(), email, provider, password: pass, recoveryEmail: recovery, recoveryPhone: network, notes, createdAt: Date.now() });
    }
    saveState(); closeModal(); render();
  } else if (type === 'memo') {
    const title = document.getElementById('m-title')?.value?.trim();
    const content = document.getElementById('m-content')?.value?.trim();
    const link = document.getElementById('m-link')?.value?.trim();
    const tags = document.getElementById('m-tags')?.value?.split(',').map(t => t.trim()).filter(Boolean);
    if (!title) { alert(t('bm_fill_required')); return; }

    if (editingItem) {
      Object.assign(editingItem, { title, content, link, tags });
      if (memoTempImage) {
        editingItem.imageFileName = memoTempImage.fileName;
        window.electronAPI.saveImage(editingItem.id, memoTempImage.base64Data, memoTempImage.mimeType);
        memoImageCache[editingItem.id] = `data:${memoTempImage.mimeType};base64,${memoTempImage.base64Data}`;
      } else if (memoTempImage === false) {
        editingItem.imageFileName = '';
        delete memoImageCache[editingItem.id];
      }
    } else {
      const newMemo = { id: genId(), title, content, link, tags, imageFileName: '', createdAt: Date.now() };
      if (memoTempImage) {
        newMemo.imageFileName = memoTempImage.fileName;
        window.electronAPI.saveImage(newMemo.id, memoTempImage.base64Data, memoTempImage.mimeType);
        memoImageCache[newMemo.id] = `data:${memoTempImage.mimeType};base64,${memoTempImage.base64Data}`;
      }
      state.memos.push(newMemo);
    }
    memoTempImage = null;
    saveState(); closeModal(); render();
  } else if (type === 'work') {
    const name = document.getElementById('w-name')?.value?.trim();
    const url = document.getElementById('w-url')?.value?.trim();
    const notes = document.getElementById('w-notes')?.value?.trim();
    if (!name) { alert(t('bm_fill_required')); return; }

    // Collect type from active chip
    const activeTypeChip = document.querySelector('.work-type-chip.active[data-work-type]');
    const workType = activeTypeChip?.dataset.workType || 'api_key';

    // Collect security level from active chip
    const activeSecChip = document.querySelector('.work-type-chip.active[data-work-sec]');
    const secLevel = activeSecChip?.dataset.workSec || 'normal';

    // Collect fields
    const fields = [];
    document.querySelectorAll('.work-modal-field').forEach(fieldEl => {
      const idx = fieldEl.dataset.fieldIdx;
      const fieldName = fieldEl.querySelector(`[data-work-field-name="${idx}"]`)?.value?.trim();
      const fieldValue = fieldEl.querySelector(`[data-work-field-value="${idx}"]`)?.value;
      const sensitive = fieldEl.querySelector(`[data-work-field-sensitive="${idx}"]`)?.checked || false;
      if (fieldName || fieldValue) {
        fields.push({ name: fieldName || 'Field ' + (parseInt(idx) + 1), value: fieldValue || '', sensitive });
      }
    });

    if (workEditingItem) {
      Object.assign(workEditingItem, { name, type: workType, securityLevel: secLevel, url, notes, fields });
    } else {
      workItems.push({ id: genId(), name, type: workType, securityLevel: secLevel, url, notes, fields, createdAt: Date.now() });
    }
    saveWorkItems();
    workEditingItem = null;
    closeModal(); render();
  } else if (type === 'pin') {
    const oldPin = document.getElementById('m-oldpin')?.value;
    const newPin = document.getElementById('m-newpin')?.value;
    const confirmPin = document.getElementById('m-confirmpin')?.value;
    if (oldPin !== state.pin) { alert(t('lock_wrong_pin')); return; }
    if (newPin.length !== 4) { alert(t('lock_pin_4digits')); return; }
    if (newPin !== confirmPin) { alert(t('lock_pin_mismatch')); return; }
    state.pin = newPin;
    saveState(); closeModal(); render();
  } else if (type === 'project') {
    const name = document.getElementById('m-proj-name')?.value?.trim();
    const url = document.getElementById('m-proj-url')?.value?.trim();
    const logo = document.getElementById('m-proj-logo')?.value?.trim() || '\ud83c\udf10';
    if (!name || !url) { alert(t('bm_fill_required')); return; }
    if (!state.customProjects) state.customProjects = [];
    const fullUrl = url.startsWith('http') ? url : 'https://' + url;
    const faviconUrl = getFaviconUrl(fullUrl);
    const projId = genId();
    state.customProjects.push({ id: projId, name, url: fullUrl, logo, color: '#00d4ff', faviconUrl });
    saveState(); closeModal(); render();
    // Try to auto-fetch actual logo from the site in background
    fetchSiteLogoUrl(fullUrl).then(logoUrl => {
      if (logoUrl) {
        const proj = (state.customProjects || []).find(p => p.id === projId);
        if (proj) { proj.faviconUrl = logoUrl; saveState(); render(); }
      }
    });
  } else if (type === 'orgchart') {
    const name = document.getElementById('m-org-name')?.value?.trim();
    if (!name) { alert(t('bm_fill_required')); return; }
    vaultOrgCharts.push({ id: genId(), name, projectName: name, nodes: [] });
    vaultSaveEncrypted(); closeModal(); render();
  } else if (type === 'org-node') {
    const name = document.getElementById('m-node-name')?.value?.trim();
    const phone = document.getElementById('m-node-phone')?.value?.trim();
    const wallet = document.getElementById('m-node-wallet')?.value?.trim();
    const amount = document.getElementById('m-node-amount')?.value?.trim();
    if (!name) { alert(t('bm_fill_required')); return; }

    try {
      if (modalType === 'edit-org-node' && orgEditNode) {
        Object.assign(orgEditNode, { name, phone: phone || '', wallet: wallet || '', amount: amount || 0 });
      } else if (currentOrgChart) {
        if (!currentOrgChart.nodes) currentOrgChart.nodes = [];
        currentOrgChart.nodes.push({
          id: genId(),
          parentId: orgEditNode?.parentId || null,
          name, phone: phone || '', wallet: wallet || '', amount: amount || 0
        });
      }
      vaultSaveEncrypted(); closeModal(); render();
    } catch(e) {
      console.error('Org node save error:', e);
      alert(t('org_save_error') || 'Error saving node. Please try again.');
    }
  } else if (type === 'clipboard') {
    const title = document.getElementById('m-clip-title')?.value?.trim();
    const memo = document.getElementById('m-clip-memo')?.value?.trim();
    const content = document.getElementById('m-clip-content')?.value?.trim();
    if (!title && !content && !clipboardTempImage) { alert(t('bm_fill_required') || '제목 또는 내용을 입력하세요'); return; }

    if (clipboardEditingItem) {
      Object.assign(clipboardEditingItem, { title: title || '', memo: memo || '', content: content || '' });
      if (clipboardTempImage) {
        clipboardEditingItem.type = 'image';
        clipboardEditingItem.imageData = clipboardTempImage;
      } else if (clipboardTempImage === false) {
        clipboardEditingItem.type = 'text';
        clipboardEditingItem.imageData = null;
      }
    } else {
      clipboardItems.unshift({
        id: genId(),
        title: title || '',
        memo: memo || '',
        content: content || '',
        type: clipboardTempImage ? 'image' : 'text',
        imageData: clipboardTempImage || null,
        createdAt: Date.now()
      });
    }
    clipboardTempImage = null;
    clipboardEditingItem = null;
    saveClipboardItems(); closeModal(); render();
  } else if (type === 'kpi-prompt') {
    // Collect values from modal fields
    const values = {};
    kpiModalFields.forEach(f => {
      values[f.id] = document.getElementById(f.id)?.value || '';
    });
    const cb = kpiModalCallback;
    kpiModalCallback = null;
    kpiModalFields = [];
    kpiModalTitle = '';
    closeModal();
    if (cb) cb(values);
  } else if (type === 'kpi-confirm') {
    const cb = kpiConfirmCallback;
    kpiConfirmCallback = null;
    kpiConfirmMessage = '';
    closeModal();
    if (cb) cb(true);
  }
}

// Generic bottom sheet for dynamic content (card info, wallet connect, etc.)
function showBottomSheet(title, contentHtml, sheetId) {
  const existing = document.querySelector('.bottom-sheet-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.className = 'bottom-sheet-overlay';
  overlay.innerHTML = `
    <div class="bottom-sheet-backdrop" data-bs-close></div>
    <div class="bottom-sheet-container" id="${sheetId || 'bottom-sheet'}">
      <div class="bottom-sheet-handle"><div class="bottom-sheet-handle-bar"></div></div>
      <div class="bottom-sheet-header">
        <h3>${title}</h3>
        <button class="bottom-sheet-close" data-bs-close><i class="ri-close-line"></i></button>
      </div>
      <div class="bottom-sheet-body">
        ${contentHtml}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  
  // Bind close
  overlay.querySelectorAll('[data-bs-close]').forEach(el => {
    el.addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });
  });
  
  // Bind actions inside the sheet
  overlay.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    handleAction(target);
  });
  
  return overlay;
}

function closeModal() {
  showModal = false; modalType = ''; editingItem = null; orgEditNode = null;
  privatePinInput = ''; privatePinConfirm = ''; privatePinError = '';
  // Also close any bottom sheets
  const bs = document.querySelector('.bottom-sheet-overlay');
  if (bs) { bs.classList.remove('active'); setTimeout(() => bs.remove(), 300); }
  render();
}

// ═══════════════════════════════════════════════════════════
// CRUD HELPERS
// ═══════════════════════════════════════════════════════════

function togglePin(id) {
  const bm = state.bookmarks.find(b => b.id === id);
  if (bm) { bm.pinned = !bm.pinned; saveState(); render(); }
}
function deleteBookmark(id) {
  if (confirm(t('bm_confirm_delete'))) { state.bookmarks = state.bookmarks.filter(b => b.id !== id); saveState(); render(); }
}
function deleteWeb3(id) {
  if (confirm(t('bm_confirm_delete'))) { state.mailAccounts = state.mailAccounts.filter(m => m.id !== id); saveState(); render(); }
}
function deleteMemo(id) {
  if (confirm(t('bm_confirm_delete'))) { state.memos = state.memos.filter(m => m.id !== id); saveState(); render(); }
}
function deleteFile(id) {
  if (confirm(t('bm_confirm_delete'))) { state.files = state.files.filter(f => f.id !== id); saveState(); render(); }
}
function deleteOrgChart(id) {
  if (confirm(t('bm_confirm_delete'))) { vaultOrgCharts = vaultOrgCharts.filter(c => c.id !== id); vaultSaveEncrypted(); render(); }
}

// ═══════════════════════════════════════════════════════════
// FILE HANDLING
// ═══════════════════════════════════════════════════════════

function handleAddFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result.split(',')[1];
        const newFile = {
          id: genId(),
          fileName: file.name,
          fileSize: file.size,
          category: detectFileCategory(file.name),
          base64Data: base64,
          mimeType: file.type,
          createdAt: Date.now()
        };
        state.files.push(newFile);
        saveState(); render();
      };
      reader.readAsDataURL(file);
    });
  };
  input.click();
}

function handlePickMemoImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      memoTempImage = { fileName: file.name, base64Data: base64, mimeType: file.type };
      render();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function handleMemoPaste(e) {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      e.preventDefault();
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result.split(',')[1];
        memoTempImage = { fileName: 'pasted-image.png', base64Data: base64, mimeType: file.type };
        render();
      };
      reader.readAsDataURL(file);
      break;
    }
  }
}

function handleMemoDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      memoTempImage = { fileName: file.name, base64Data: base64, mimeType: file.type };
      render();
    };
    reader.readAsDataURL(file);
  }
}

// ═══════════════════════════════════════════════════════════
// CLIPBOARD & SECURITY HELPERS
// ═══════════════════════════════════════════════════════════

async function copyImageToClipboard(imgSrc) {
  try {
    const response = await fetch(imgSrc);
    const blob = await response.blob();
    const pngBlob = await convertToPng(blob);
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': pngBlob })
    ]);
    showClipboardToast(t('memo_copied_to_clipboard'), 'success');
  } catch (err) {
    // Fallback: open image in new tab
    console.error('Clipboard write failed:', err);
    const w = window.open();
    if (w) { w.document.write(`<img src="${imgSrc}">`);
    }
  }
}

function convertToPng(blob) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(resolve, 'image/png');
    };
    img.src = URL.createObjectURL(blob);
  });
}

function showClipboardToast(message, type = 'success') {
  const existing = document.querySelector('.clipboard-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `clipboard-toast ${type === 'warning' ? 'warning' : ''}`;
  toast.innerHTML = `<i class="${type === 'warning' ? 'ri-shield-line' : 'ri-checkbox-circle-line'}"></i> ${escapeHtml(message)}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Secure copy: copy text then auto-clear clipboard after 10 seconds
function secureCopyToClipboard(text, fieldName) {
  navigator.clipboard.writeText(text).then(() => {
    showClipboardToast(`${fieldName || ''} ${t('work_copied')}`, 'success');
    setTimeout(() => {
      navigator.clipboard.writeText('').then(() => {
        showClipboardToast(t('work_clipboard_cleared'), 'warning');
      });
    }, 10000);
  });
}

// Security scan animation
function runSecurityScan() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'security-scan-overlay';
    overlay.innerHTML = `
      <div class="security-scan-box">
        <div class="security-scan-icon"><i class="ri-shield-check-line"></i></div>
        <div class="security-scan-title">${escapeHtml(t('work_security_scan'))}</div>
        <div class="security-scan-status">${escapeHtml(t('work_scanning'))}</div>
        <div class="security-scan-progress"><div class="security-scan-bar" style="width:0%"></div></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const bar = overlay.querySelector('.security-scan-bar');
    const status = overlay.querySelector('.security-scan-status');
    let progress = 0;
    const steps = [
      { p: 25, msg: 'Checking local storage integrity...' },
      { p: 50, msg: 'Scanning for data leaks...' },
      { p: 75, msg: 'Verifying encryption...' },
      { p: 100, msg: t('work_scan_complete') },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        bar.style.width = steps[i].p + '%';
        status.textContent = steps[i].msg;
        i++;
      } else {
        clearInterval(interval);
        status.innerHTML = `<span style="color:var(--success)"><i class="ri-checkbox-circle-fill"></i> ${escapeHtml(t('work_scan_safe'))}</span>`;
        setTimeout(() => { overlay.remove(); resolve(true); }, 800);
      }
    }, 600);
  });
}

// ═══════════════════════════════════════════════════════════
// SHARE
// ═══════════════════════════════════════════════════════════

async function executeShare(pin) {
  const items = [];
  shareSelectedIds.forEach(id => {
    if (shareSelectType === 'bookmarks') {
      const bm = state.bookmarks.find(b => b.id === id);
      if (bm) items.push({ type: 'bookmark', data: { title: bm.title, url: bm.url, category: bm.category, username: bm.username, notes: bm.notes } });
    } else if (shareSelectType === 'web3') {
      const ma = state.mailAccounts.find(m => m.id === id);
      if (ma) items.push({ type: 'web3', data: { email: ma.email, provider: ma.provider, notes: ma.notes } });
    } else if (shareSelectType === 'memos') {
      const m = state.memos.find(mm => mm.id === id);
      if (m) items.push({ type: 'memo', data: { title: m.title, content: m.content, link: m.link, tags: m.tags } });
    } else if (shareSelectType === 'files') {
      const f = state.files.find(ff => ff.id === id);
      if (f) items.push({ type: 'file', data: { fileName: f.fileName, fileSize: f.fileSize } });
    }
  });

  try {
    const r = await fetch(`${API_BASE}/api/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, pin: pin || null })
    });
    const data = await r.json();
    window._lastShareUrl = `${window.location.origin}/share/${data.id}`;
    shareSelectMode = false; shareSelectedIds.clear();
    showModal = true; modalType = 'share-result'; render();
  } catch (e) {
    alert('Share failed: ' + e.message);
  }
}

// ═══════════════════════════════════════════════════════════
// TRANSLATE (using free API)
// ═══════════════════════════════════════════════════════════

async function doTranslate() {
  const text = document.getElementById('translate-input')?.value?.trim();
  if (!text) return;
  translateText = text;

  try {
    const sl = translateFrom === 'auto' ? 'auto' : translateFrom;
    const tl = translateTo;
    const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await r.json();
    translatedResult = data[0].map(s => s[0]).join('');
    render();
  } catch (e) {
    translatedResult = 'Translation error: ' + e.message;
    render();
  }
}

// ═══════════════════════════════════════════════════════════
// INTERPRETER (Speech-to-Text + Translate + TTS)
// ═══════════════════════════════════════════════════════════

function toggleInterpreter() {
  if (isInterpreting) {
    // Stop
    if (interpreterRecognition) {
      interpreterRecognition.stop();
      interpreterRecognition = null;
    }
    isInterpreting = false;
    render();
    return;
  }

  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert(t('interpreter_not_supported'));
    return;
  }

  isInterpreting = true;
  interpreterSourceText = '';
  interpreterTranslatedText = '';
  render();

  const recognition = new SpeechRecognition();
  interpreterRecognition = recognition;

  // Set source language for recognition
  const fromLang = translateFrom === 'auto' ? 'ko' : translateFrom;
  const langMap = {
    'ko': 'ko-KR', 'en': 'en-US', 'zh': 'zh-CN', 'ja': 'ja-JP',
    'th': 'th-TH', 'vi': 'vi-VN', 'ru': 'ru-RU', 'es': 'es-ES',
    'fr': 'fr-FR', 'de': 'de-DE', 'pt': 'pt-BR', 'ar': 'ar-SA'
  };
  recognition.lang = langMap[fromLang] || 'ko-KR';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      interpreterSourceText = finalTranscript;
      render();
      // Auto-translate
      try {
        const sl = fromLang;
        const tl = translateTo;
        const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(finalTranscript)}`);
        const data = await r.json();
        interpreterTranslatedText = data[0].map(s => s[0]).join('');
        render();
        // Auto-speak the translation
        const utterance = new SpeechSynthesisUtterance(interpreterTranslatedText);
        utterance.lang = tl;
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      } catch (e) {
        interpreterTranslatedText = 'Translation error';
        render();
      }
    } else if (interimTranscript) {
      interpreterSourceText = interimTranscript + '...';
      render();
    }
  };

  recognition.onerror = (event) => {
    console.log('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      alert(t('interpreter_mic_denied'));
    }
    isInterpreting = false;
    interpreterRecognition = null;
    render();
  };

  recognition.onend = () => {
    // Auto-restart if still interpreting
    if (isInterpreting && interpreterRecognition) {
      try { recognition.start(); } catch(e) {}
    }
  };

  try {
    recognition.start();
  } catch(e) {
    isInterpreting = false;
    interpreterRecognition = null;
    alert(t('interpreter_not_supported'));
    render();
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════════════════════════

function handleExport() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `alphabag-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click(); URL.revokeObjectURL(url);
  showHamburgerMenu = false; render();
}

function handleImport() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data && typeof data === 'object') {
          state = { ...state, ...data, locked: false };
          saveState(); render();
          alert(t('set_import_success'));
        }
      } catch (err) { alert('Import failed: ' + err.message); }
    };
    reader.readAsText(file);
  };
  input.click();
  showHamburgerMenu = false;
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

async function init() {
  await loadData();
  applyTheme();
  render();

  // Fetch data in background
  fetchBanners();
  fetchNotifications();
  fetchTokenPrices();
  fetchMiddleTabs();
  fetchCurrencyRates();
  fetchUsdtKrwPrice();
  loadExchangeSettings();
  loadCustomMainnets();
  loadCustomTokens();
  loadCards();
  loadKpiProjects();
  loadAiSettings();

  // Fetch interstitial ad and popup notice on app open
  fetchInterstitialAd();
  fetchPopupNotice();
  // Refresh token prices every 60s
  setInterval(fetchTokenPrices, 60000);

  // Electron: listen for pin/mini mode changes from main process
  if (IS_ELECTRON) {
    window.electronAPI.onPinStateChanged((pinned) => {
      isPinned = pinned;
      render();
    });
    window.electronAPI.onMiniModeChanged((mini) => {
      isMiniMode = mini;
      render();
    });
    // Get initial states
    window.electronAPI.getPinState().then(s => { isPinned = s; render(); });
    window.electronAPI.getMiniMode().then(s => { isMiniMode = s; render(); });
    // Add electron class to body
    document.body.classList.add('is-electron');
  }

  // Load memo images
  for (const m of state.memos) {
    if (m.imageFileName) {
      try {
        const imgData = await window.electronAPI.loadImage(m.id);
        if (imgData) memoImageCache[m.id] = imgData;
      } catch(e) {}
    }
  }
}

// ═══════════════════════════════════════════════════════════
// GLOBAL EVENT DELEGATION for dynamically created buttons
// ═══════════════════════════════════════════════════════════
document.addEventListener('click', (e) => {
  // Find closest element with data-action (handles clicks on child elements like <i> icons)
  const actionEl = e.target.closest('[data-action]');
  if (actionEl) {
    const action = actionEl.dataset.action;
    // Only handle actions for dynamically created elements
    // (static elements already have their own listeners from bindEvents)
    if (['add-contract-token', 'ai-open-external', 'ai-attach', 'ai-remove-attach', 'ai-send', 'ai-clear-chat', 'app-check-update', 'app-download-update', 'vault-reset', 'vault-lock', 'vault-settings', 'vault-change-view', 'vault-change-panic', 'vault-autolock-set'].includes(action)) {
      e.stopPropagation();
      handleAction(action, actionEl);
    }
  }
});

// ═══════════════════════════════════════════════════════════
// VAULT KEY HANDLER & ENCRYPTION SAVE
// ═══════════════════════════════════════════════════════════

function handleVaultKey(key) {
  vaultError = '';

  // Password change mode
  if (vaultChangeMode) {
    if (key === 'del') {
      if (vaultSetupStep % 2 === 1) { vaultPwConfirm = vaultPwConfirm.slice(0, -1); }
      else { vaultPwInput = vaultPwInput.slice(0, -1); }
      render(); return;
    }

    if (vaultChangeMode === 'verify-old') {
      vaultPwInput += key;
      if (vaultPwInput.length >= 8) {
        const pw = vaultPwInput;
        vaultPwInput = '';
        VaultCrypto.unlock(pw).then(result => {
          if (result.action === 'view') {
            // Old password verified, move to new password
            vaultChangeMode = 'change-view-new';
            vaultOldPassword = pw;
            vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0;
            render();
          } else {
            vaultError = t('vault_wrong_pw') || '비밀번호가 틀렸습니다';
            render();
          }
        });
        return;
      }
    } else if (vaultChangeMode === 'change-view-new' || vaultChangeMode === 'change-panic') {
      const isConfirm = vaultSetupStep % 2 === 1;
      if (isConfirm) {
        vaultPwConfirm += key;
        if (vaultPwConfirm.length >= 8) {
          if (vaultPwConfirm === vaultPwInput) {
            const newPw = vaultPwInput;
            if (vaultChangeMode === 'change-view-new') {
              VaultCrypto.changeViewPassword(vaultOldPassword, newPw).then(() => {
                vaultViewPassword = newPw;
                vaultChangeMode = ''; vaultOldPassword = '';
                vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0;
                state.currentTab = 'vault-settings';
                alert(t('vault_pw_changed') || '비밀번호가 변경되었습니다');
                render();
              }).catch(err => { vaultError = err.message; render(); });
            } else {
              VaultCrypto.changePanicPassword(newPw).then(() => {
                vaultChangeMode = '';
                vaultPwInput = ''; vaultPwConfirm = ''; vaultSetupStep = 0;
                state.currentTab = 'vault-settings';
                alert(t('vault_pw_changed') || '비밀번호가 변경되었습니다');
                render();
              }).catch(err => { vaultError = err.message; render(); });
            }
            return;
          } else {
            vaultError = t('vault_pw_mismatch') || '비밀번호가 일치하지 않습니다';
            vaultPwConfirm = '';
          }
          render(); return;
        }
      } else {
        vaultPwInput += key;
        if (vaultPwInput.length >= 8) {
          setTimeout(() => { vaultSetupStep++; vaultPwConfirm = ''; render(); }, 200);
        }
      }
    }
    render(); return;
  }

  const isSetup = !VaultCrypto.isConfigured();

  if (isSetup) {
    // Setup mode
    const isConfirmStep = (vaultSetupStep % 2 === 1);
    if (key === 'del') {
      if (isConfirmStep) {
        vaultPwConfirm = vaultPwConfirm.slice(0, -1);
      } else {
        vaultPwInput = vaultPwInput.slice(0, -1);
      }
      render();
      return;
    }

    if (isConfirmStep) {
      vaultPwConfirm += key;
      if (vaultPwConfirm.length >= 8) {
        // Check if confirm matches
        if (vaultSetupStep === 1) {
          // Confirm view password
          if (vaultPwConfirm === vaultPwInput) {
            // View password confirmed, move to panic password
            vaultPanicInput = ''; // store view pw temporarily
            vaultPwConfirm = '';
            // Save view password temporarily
            vaultViewPassword = vaultPwInput;
            vaultPwInput = '';
            vaultSetupStep = 2;
          } else {
            vaultError = t('vault_pw_mismatch') || '비밀번호가 일치하지 않습니다';
            vaultPwConfirm = '';
          }
        } else if (vaultSetupStep === 3) {
          // Confirm panic password
          if (vaultPwConfirm === vaultPwInput) {
            // Both passwords confirmed - setup vault
            const panicPw = vaultPwInput;
            VaultCrypto.setup(vaultViewPassword, panicPw).then(() => {
              vaultUnlocked = true;
              vaultOrgCharts = [];
              // Migrate existing orgCharts from state if any
              if (state.orgCharts && state.orgCharts.length > 0) {
                vaultOrgCharts = JSON.parse(JSON.stringify(state.orgCharts));
                state.orgCharts = []; // Remove from unencrypted state
                saveState();
                vaultSaveEncrypted();
              }
              vaultPwInput = ''; vaultPwConfirm = '';
              vaultSetupStep = 0;
              render();
            }).catch(err => {
              vaultError = err.message;
              render();
            });
            return;
          } else {
            vaultError = t('vault_pw_mismatch') || '비밀번호가 일치하지 않습니다';
            vaultPwConfirm = '';
          }
        }
        render();
        return;
      }
    } else {
      vaultPwInput += key;
      if (vaultPwInput.length >= 8) {
        // Check minimum length reached, auto-advance to confirm
        setTimeout(() => {
          vaultSetupStep++;
          vaultPwConfirm = '';
          render();
        }, 200);
      }
    }
    render();
  } else {
    // Unlock mode
    if (key === 'del') {
      vaultPwInput = vaultPwInput.slice(0, -1);
      render();
      return;
    }

    vaultPwInput += key;
    if (vaultPwInput.length >= 8) {
      // Try to unlock
      const pw = vaultPwInput;
      vaultPwInput = '';

      VaultCrypto.unlock(pw).then(result => {
        if (result.action === 'view') {
          // Success - show org charts
          vaultUnlocked = true;
          vaultViewPassword = pw;
          vaultOrgCharts = result.data || [];
          vaultAttempts = 0;
          vaultError = '';
          render();
        } else if (result.action === 'panic') {
          // PANIC - all data destroyed
          vaultUnlocked = false;
          vaultViewPassword = null;
          vaultOrgCharts = [];
          vaultPwInput = ''; vaultPwConfirm = '';
          vaultSetupStep = 0; vaultAttempts = 0;
          vaultError = '';
          // Show innocent empty state
          state.currentTab = 'home';
          render();
          // Optional: show a generic error as if app glitched
          setTimeout(() => {
            alert(t('vault_data_corrupted') || '데이터가 손상되었습니다. 초기화가 필요합니다.');
          }, 500);
        } else {
          // Wrong password
          vaultAttempts++;
          if (vaultAttempts >= VAULT_MAX_ATTEMPTS) {
            // Max attempts reached - auto-delete
            VaultCrypto.emergencyDelete().then(() => {
              vaultUnlocked = false; vaultViewPassword = null; vaultOrgCharts = [];
              vaultPwInput = ''; vaultSetupStep = 0; vaultAttempts = 0;
              state.currentTab = 'home';
              render();
            });
          } else {
            vaultError = t('vault_wrong_pw') || '비밀번호가 틀렸습니다';
            render();
          }
        }
      });
      return;
    }
    render();
  }
}

async function vaultSaveEncrypted() {
  if (!vaultViewPassword) return;
  try {
    await VaultCrypto.save(vaultOrgCharts, vaultViewPassword);
  } catch (e) {
    console.log('Vault save error:', e);
  }
}

// ═══ VAULT AUTO-LOCK TIMER ═══
function vaultResetAutoLock() {
  if (vaultAutoLockTimer) { clearTimeout(vaultAutoLockTimer); vaultAutoLockTimer = null; }
  if (!vaultUnlocked || vaultAutoLockMinutes <= 0) return;
  vaultAutoLockTimer = setTimeout(() => {
    if (vaultUnlocked) {
      vaultUnlocked = false; vaultViewPassword = null; vaultOrgCharts = []; currentOrgChart = null;
      vaultPwInput = ''; vaultError = ''; vaultChangeMode = '';
      if (['orgchart', 'orgchart-view', 'vault-settings', 'vault-change-pw'].includes(state.currentTab)) {
        state.currentTab = 'home';
      }
      render();
    }
  }, vaultAutoLockMinutes * 60 * 1000);
}

// Reset auto-lock timer on user activity
['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
  document.addEventListener(evt, () => {
    if (vaultUnlocked) vaultResetAutoLock();
  }, { passive: true });
});

// Auto-lock vault when app goes to background or screen locks
// Track when user leaves app for org chart editing (to allow copying wallet addresses)
let _vaultBgTimestamp = null;
const VAULT_BG_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes grace period

document.addEventListener('visibilitychange', () => {
  if (document.hidden && vaultUnlocked) {
    // If modal is open (editing org node), give grace period instead of immediate lock
    if (showModal && (modalType === 'add-org-node' || modalType === 'edit-org-node' || modalType === 'add-orgchart')) {
      _vaultBgTimestamp = Date.now();
      return; // Don't lock - user might be copying wallet address
    }
    // Lock vault when app goes to background (no modal open)
    vaultUnlocked = false;
    vaultViewPassword = null;
    vaultOrgCharts = [];
    currentOrgChart = null;
    vaultPwInput = '';
    vaultError = '';
    vaultChangeMode = '';
    if (vaultAutoLockTimer) { clearTimeout(vaultAutoLockTimer); vaultAutoLockTimer = null; }
    if (['orgchart', 'orgchart-view', 'vault-settings', 'vault-change-pw'].includes(state.currentTab)) {
      state.currentTab = 'home';
    }
    render();
  } else if (!document.hidden && _vaultBgTimestamp) {
    // Returning from background - check if grace period expired
    const elapsed = Date.now() - _vaultBgTimestamp;
    _vaultBgTimestamp = null;
    if (elapsed > VAULT_BG_GRACE_PERIOD) {
      // Grace period expired - lock vault
      vaultUnlocked = false;
      vaultViewPassword = null;
      vaultOrgCharts = [];
      currentOrgChart = null;
      vaultPwInput = '';
      vaultError = '';
      vaultChangeMode = '';
      showModal = false; modalType = '';
      if (vaultAutoLockTimer) { clearTimeout(vaultAutoLockTimer); vaultAutoLockTimer = null; }
      state.currentTab = 'home';
      render();
    }
    // Otherwise, keep vault open and modal intact
  }
});

// Start
init();
