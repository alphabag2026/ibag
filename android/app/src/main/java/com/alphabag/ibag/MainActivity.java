package com.alphabag.ibag;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

import java.util.ArrayList;

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

import org.json.JSONObject;
import org.json.JSONArray;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "iBagWallet";
    private static final int PERMISSION_REQUEST_CODE = 1001;
    private String web3ProviderScript = null;
    private WebView mainWebView = null;
    private Handler mainHandler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestAllPermissions();
    }

    @Override
    public void onStart() {
        super.onStart();

        // Load web3-provider.js from assets
        loadWeb3ProviderScript();

        Bridge bridge = getBridge();
        if (bridge != null) {
            WebView webView = bridge.getWebView();
            mainWebView = webView;
            
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                
                // Add JavaScript Interface for native bridge communication
                webView.addJavascriptInterface(new Web3NativeBridge(), "iBagNativeBridge");

                // WebChromeClient for media permissions (microphone, camera in WebView)
                webView.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public void onPermissionRequest(final PermissionRequest request) {
                        Log.d(TAG, "WebView permission request: " + java.util.Arrays.toString(request.getResources()));
                        mainHandler.post(() -> request.grant(request.getResources()));
                    }
                });
            }

            bridge.setWebViewClient(new BridgeWebViewClient(bridge) {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    injectWeb3Provider(view, url);
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                    String url = request.getUrl().toString();
                    Log.d(TAG, "URL loading: " + url);

                    // Let Capacitor handle its own URLs
                    if (url.startsWith("https://localhost") ||
                        url.startsWith("capacitor://") ||
                        url.startsWith("https://capacitor") ||
                        url.contains("localhost")) {
                        return super.shouldOverrideUrlLoading(view, request);
                    }

                    // ─── WalletConnect deep links ───
                    if (url.startsWith("wc:")) {
                        Log.d(TAG, "WalletConnect URI detected: " + url);
                        return handleWalletConnectUri(url);
                    }

                    // ─── Wallet app deep links ───
                    if (isWalletDeepLink(url)) {
                        Log.d(TAG, "Wallet deep link detected: " + url);
                        return openExternalApp(url);
                    }

                    // ─── Intent scheme (intent://) ───
                    if (url.startsWith("intent://")) {
                        Log.d(TAG, "Intent URI detected: " + url);
                        return handleIntentUri(url);
                    }

                    // ─── Allow navigation within DApp iframe ───
                    if (url.startsWith("http://") || url.startsWith("https://")) {
                        return super.shouldOverrideUrlLoading(view, request);
                    }

                    // Open other schemes in system browser
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception e) {
                        Log.e(TAG, "Failed to open URL: " + url, e);
                    }
                    return true;
                }
            });
        }
    }

    /**
     * JavaScript Interface for native bridge communication
     * Allows web3-provider.js to communicate with native Android code
     */
    public class Web3NativeBridge {

        /**
         * Open a wallet app with WalletConnect URI
         */
        @JavascriptInterface
        public void openWalletApp(String walletId, String wcUri) {
            Log.d(TAG, "openWalletApp: " + walletId + " uri: " + wcUri);
            mainHandler.post(() -> {
                try {
                    String deepLink = getWalletDeepLink(walletId, wcUri);
                    if (deepLink != null) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(deepLink));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } else {
                        // Fallback: open Play Store for the wallet
                        String packageName = getWalletPackageName(walletId);
                        if (packageName != null) {
                            Intent storeIntent = new Intent(Intent.ACTION_VIEW,
                                Uri.parse("market://details?id=" + packageName));
                            storeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(storeIntent);
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open wallet: " + walletId, e);
                }
            });
        }

        /**
         * Open external URL in system browser
         */
        @JavascriptInterface
        public void openExternalUrl(String url) {
            Log.d(TAG, "openExternalUrl: " + url);
            mainHandler.post(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open URL: " + url, e);
                }
            });
        }

        /**
         * Check if a wallet app is installed
         */
        @JavascriptInterface
        public boolean isWalletInstalled(String walletId) {
            String packageName = getWalletPackageName(walletId);
            if (packageName == null) return false;
            return isAppInstalled(packageName);
        }

        /**
         * Get list of installed wallet apps
         */
        @JavascriptInterface
        public String getInstalledWallets() {
            JSONArray result = new JSONArray();
            String[][] wallets = {
                {"metamask", "io.metamask"},
                {"trust", "com.trustwallet.app"},
                {"tokenpocket", "vip.mytokenpocket"},
                {"okx", "com.okex.wallet"},
                {"coinbase", "com.coinbase.android"},
                {"binance", "com.binance.dev"},
                {"gate", "io.gate.gateio"},
                {"rainbow", "me.rainbow"},
                {"phantom", "app.phantom"},
                {"zerion", "io.zerion.android"},
            };
            for (String[] w : wallets) {
                if (isAppInstalled(w[1])) {
                    try {
                        JSONObject obj = new JSONObject();
                        obj.put("id", w[0]);
                        obj.put("package", w[1]);
                        result.put(obj);
                    } catch (Exception e) {}
                }
            }
            return result.toString();
        }

        /**
         * Open DApp URL directly in a specific wallet app's built-in browser
         */
        @JavascriptInterface
        public void openDAppInWallet(String walletId, String dappUrl) {
            Log.d(TAG, "openDAppInWallet: " + walletId + " url: " + dappUrl);
            mainHandler.post(() -> {
                try {
                    String deepLink = getWalletDAppLink(walletId, dappUrl);
                    if (deepLink != null) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(deepLink));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open DApp in wallet: " + walletId, e);
                }
            });
        }

        /**
         * Show a native toast message
         */
        @JavascriptInterface
        public void showToast(String message) {
            mainHandler.post(() -> {
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
            });
        }

        /**
         * Send callback result back to JavaScript
         */
        @JavascriptInterface
        public void sendCallbackToJS(String callbackId, String result) {
            mainHandler.post(() -> {
                if (mainWebView != null) {
                    String js = "javascript:window.__iBagNativeCallback && window.__iBagNativeCallback('" 
                        + callbackId + "'," + result + ")";
                    mainWebView.evaluateJavascript(js, null);
                }
            });
        }
    }

    /**
     * Get wallet deep link for WalletConnect URI
     */
    private String getWalletDeepLink(String walletId, String wcUri) {
        String encodedUri = Uri.encode(wcUri);
        switch (walletId.toLowerCase()) {
            case "metamask":
                return "metamask://wc?uri=" + encodedUri;
            case "trust":
                return "trust://wc?uri=" + encodedUri;
            case "tokenpocket":
                return "tpoutside://wc?uri=" + encodedUri;
            case "okx":
                return "okx://wc?uri=" + encodedUri;
            case "coinbase":
                return "cbwallet://wc?uri=" + encodedUri;
            case "binance":
                return "bnc://wc?uri=" + encodedUri;
            case "gate":
                return "gateio://wc?uri=" + encodedUri;
            case "rainbow":
                return "rainbow://wc?uri=" + encodedUri;
            case "phantom":
                return "phantom://wc?uri=" + encodedUri;
            case "zerion":
                return "zerion://wc?uri=" + encodedUri;
            default:
                return null;
        }
    }

    /**
     * Get wallet deep link for opening DApp directly
     */
    private String getWalletDAppLink(String walletId, String dappUrl) {
        String encodedUrl = Uri.encode(dappUrl);
        switch (walletId.toLowerCase()) {
            case "metamask":
                return "https://metamask.app.link/dapp/" + dappUrl.replaceFirst("https?://", "");
            case "trust":
                return "trust://open_url?coin_id=60&url=" + encodedUrl;
            case "tokenpocket":
                return "tpoutside://open?params=" + encodedUrl;
            case "okx":
                return "okx://wallet/dapp/url?dappUrl=" + encodedUrl;
            case "coinbase":
                return "https://go.cb-w.com/dapp?cb_url=" + encodedUrl;
            case "binance":
                return "bnc://app.binance.com/cedefi/dapp-browser?url=" + encodedUrl;
            case "gate":
                return "gateio://url?url=" + encodedUrl;
            case "rainbow":
                return "rainbow://dapp?url=" + encodedUrl;
            case "phantom":
                return "phantom://browse/" + encodedUrl;
            case "zerion":
                return "zerion://browser?url=" + encodedUrl;
            default:
                return null;
        }
    }

    /**
     * Get package name for wallet ID
     */
    private String getWalletPackageName(String walletId) {
        switch (walletId.toLowerCase()) {
            case "metamask": return "io.metamask";
            case "trust": return "com.trustwallet.app";
            case "tokenpocket": return "vip.mytokenpocket";
            case "okx": return "com.okex.wallet";
            case "coinbase": return "com.coinbase.android";
            case "binance": return "com.binance.dev";
            case "gate": return "io.gate.gateio";
            case "rainbow": return "me.rainbow";
            case "phantom": return "app.phantom";
            case "zerion": return "io.zerion.android";
            default: return null;
        }
    }

    /**
     * Load web3-provider.js from assets folder
     */
    private void loadWeb3ProviderScript() {
        try {
            InputStream is = getAssets().open("public/web3-provider.js");
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            reader.close();
            is.close();
            web3ProviderScript = sb.toString();
            Log.d(TAG, "Web3 Provider script loaded (" + web3ProviderScript.length() + " chars)");
        } catch (Exception e) {
            Log.e(TAG, "Failed to load web3-provider.js", e);
        }
    }

    /**
     * Inject Web3 Provider into WebView pages
     * Only inject into external DApp URLs (not our own app)
     */
    private void injectWeb3Provider(WebView view, String url) {
        if (web3ProviderScript == null) return;
        
        if (url != null && !url.contains("localhost") && !url.startsWith("capacitor://") 
            && (url.startsWith("http://") || url.startsWith("https://"))) {
            
            view.evaluateJavascript(
                "(function() {" +
                "  if (window.__iBagProviderInjected) return;" +
                "  window.__iBagProviderInjected = true;" +
                "  window.__iBagIsNativeApp = true;" +
                "  try {" + web3ProviderScript + "} catch(e) { console.error('[iBag] Provider injection error:', e); }" +
                "})();",
                null
            );
            Log.d(TAG, "Web3 Provider injected into: " + url);
        }
    }

    /**
     * Handle WalletConnect URIs (wc:...)
     */
    private boolean handleWalletConnectUri(String wcUri) {
        String[][] walletApps = {
            {"io.metamask", "metamask://wc?uri="},
            {"com.trustwallet.app", "trust://wc?uri="},
            {"vip.mytokenpocket", "tpoutside://wc?uri="},
            {"com.wallet.crypto.trustapp", "trust://wc?uri="},
            {"com.binance.dev", "bnc://wc?uri="},
            {"io.gate.gateio", "gateio://wc?uri="},
            {"com.okex.wallet", "okx://wc?uri="},
            {"com.coinbase.android", "cbwallet://wc?uri="},
            {"org.toshi", "cbwallet://wc?uri="},
        };

        String encodedUri = Uri.encode(wcUri);

        for (String[] wallet : walletApps) {
            String packageName = wallet[0];
            String scheme = wallet[1];
            if (isAppInstalled(packageName)) {
                try {
                    String deepLink = scheme + encodedUri;
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(deepLink));
                    intent.setPackage(packageName);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    Log.d(TAG, "Opened WC in: " + packageName);
                    return true;
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open " + packageName, e);
                }
            }
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(wcUri));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            List<ResolveInfo> activities = getPackageManager().queryIntentActivities(intent, 0);
            if (!activities.isEmpty()) {
                startActivity(intent);
                return true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Generic WC handler failed", e);
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW,
                Uri.parse("https://explorer.walletconnect.com/"));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception e) {
            Log.e(TAG, "Failed to open WC explorer", e);
        }
        return true;
    }

    private boolean isWalletDeepLink(String url) {
        String[] walletSchemes = {
            "metamask://", "trust://", "tpoutside://", "tokenpocket://",
            "bnc://", "gateio://", "okx://", "okex://",
            "cbwallet://", "coinbase://", "rainbow://",
            "uniswap://", "zerion://", "phantom://",
            "solflare://", "keplr://", "leap://",
            "dapp://", "wc://"
        };
        String lower = url.toLowerCase();
        for (String scheme : walletSchemes) {
            if (lower.startsWith(scheme)) return true;
        }
        return false;
    }

    private boolean handleIntentUri(String url) {
        try {
            Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            List<ResolveInfo> activities = getPackageManager()
                .queryIntentActivities(intent, 0);
            if (!activities.isEmpty()) {
                startActivity(intent);
                return true;
            }
            String packageName = intent.getPackage();
            if (packageName != null) {
                Intent storeIntent = new Intent(Intent.ACTION_VIEW,
                    Uri.parse("market://details?id=" + packageName));
                storeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(storeIntent);
                return true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to handle intent URI", e);
        }
        return true;
    }

    private boolean openExternalApp(String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Failed to open external app: " + url, e);
            return false;
        }
    }

    private boolean isAppInstalled(String packageName) {
        try {
            getPackageManager().getPackageInfo(packageName, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    /**
     * Request all necessary permissions at app startup
     */
    private void requestAllPermissions() {
        ArrayList<String> permissionsNeeded = new ArrayList<>();

        // Microphone
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.RECORD_AUDIO);
        }

        // Camera
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.CAMERA);
        }

        // Storage (Android 12 and below)
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
        } else {
            // Android 13+ media permissions
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_VIDEO)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.READ_MEDIA_VIDEO);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_AUDIO)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.READ_MEDIA_AUDIO);
            }
        }

        // Notifications (Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }

        if (!permissionsNeeded.isEmpty()) {
            String[] permissions = permissionsNeeded.toArray(new String[0]);
            Log.d(TAG, "Requesting permissions: " + permissionsNeeded.toString());
            ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQUEST_CODE);
        } else {
            Log.d(TAG, "All permissions already granted");
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            for (int i = 0; i < permissions.length; i++) {
                String perm = permissions[i];
                boolean granted = grantResults[i] == PackageManager.PERMISSION_GRANTED;
                Log.d(TAG, "Permission " + perm + ": " + (granted ? "GRANTED" : "DENIED"));
            }
        }
    }
}
