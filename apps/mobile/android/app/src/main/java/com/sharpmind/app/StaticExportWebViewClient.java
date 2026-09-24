package com.sharpmind.app;

import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
 * Makes Capacitor's local server understand the Next.js static export produced by apps/web.
 *
 * Capacitor runs in "HTML5 mode" and answers every extension-less path with the root
 * {@code index.html}. That is right for single-page apps, but apps/web is exported with
 * {@code trailingSlash: true}, so every route has its own pre-rendered {@code <route>/index.html}.
 * Serving the root page for {@code /app/planner/} (full reloads, {@code window.location} redirects,
 * deep links) would hydrate the landing page under the wrong URL.
 *
 * This client rewrites such requests to {@code <route>/index.html} (or {@code 404.html} when the
 * route was not exported) and then delegates to Capacitor, so asset serving, MIME types and
 * bridge-script injection stay exactly as Capacitor implements them.
 */
public class StaticExportWebViewClient extends BridgeWebViewClient {

    private static final String NOT_FOUND_PAGE = "/404.html";

    private final Bridge bridge;

    public StaticExportWebViewClient(Bridge bridge) {
        super(bridge);
        this.bridge = bridge;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return super.shouldInterceptRequest(view, resolve(request));
    }

    private WebResourceRequest resolve(WebResourceRequest request) {
        Uri url = request.getUrl();
        if (!"GET".equalsIgnoreCase(request.getMethod())) return request;
        if (!bridge.getScheme().equalsIgnoreCase(url.getScheme())) return request;
        if (!bridge.getHost().equalsIgnoreCase(url.getHost())) return request;

        String rewritten = rewritePath(url.getPath(), this::exists);
        if (rewritten == null) return request;
        return new RewrittenRequest(request, url.buildUpon().path(rewritten).build());
    }

    /**
     * Returns the exported file that should answer {@code path}, or {@code null} to leave the
     * request untouched (root, files with an extension, or anything we cannot map).
     */
    @VisibleForTesting
    @Nullable
    static String rewritePath(@Nullable String path, @NonNull ExistsCheck exists) {
        if (path == null || path.isEmpty() || path.equals("/")) return null;

        String trimmed = path.endsWith("/") ? path.substring(0, path.length() - 1) : path;
        String lastSegment = trimmed.substring(trimmed.lastIndexOf('/') + 1);
        if (lastSegment.contains(".")) return null;

        String routeIndex = trimmed + "/index.html";
        if (exists.test(routeIndex)) return routeIndex;

        String routeHtml = trimmed + ".html";
        if (exists.test(routeHtml)) return routeHtml;

        return exists.test(NOT_FOUND_PAGE) ? NOT_FOUND_PAGE : null;
    }

    private boolean exists(String relativePath) {
        String basePath = bridge.getServerBasePath();
        if (basePath == null) return false;
        if (basePath.startsWith("/")) {
            // Live-update bundles are served from the filesystem rather than APK assets.
            return new File(basePath + relativePath).isFile();
        }
        AssetManager assets = bridge.getContext().getAssets();
        try (InputStream ignored = assets.open(basePath + relativePath)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    @VisibleForTesting
    interface ExistsCheck {
        boolean test(String relativePath);
    }

    /** Delegating request whose only difference is the resolved URL. */
    private static final class RewrittenRequest implements WebResourceRequest {

        private final WebResourceRequest original;
        private final Uri url;

        RewrittenRequest(WebResourceRequest original, Uri url) {
            this.original = original;
            this.url = url;
        }

        @Override
        public Uri getUrl() {
            return url;
        }

        @Override
        public boolean isForMainFrame() {
            return original.isForMainFrame();
        }

        @Override
        public boolean isRedirect() {
            return original.isRedirect();
        }

        @Override
        public boolean hasGesture() {
            return original.hasGesture();
        }

        @Override
        public String getMethod() {
            return original.getMethod();
        }

        @Override
        public Map<String, String> getRequestHeaders() {
            return original.getRequestHeaders();
        }
    }
}
