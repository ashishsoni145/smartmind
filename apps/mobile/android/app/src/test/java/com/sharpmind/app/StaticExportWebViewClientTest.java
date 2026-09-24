package com.sharpmind.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;

public class StaticExportWebViewClientTest {

    private static final Set<String> EXPORTED = new HashSet<>(
        Arrays.asList("/index.html", "/404.html", "/app/index.html", "/app/planner/index.html", "/legacy.html")
    );

    private static String rewrite(String path) {
        return StaticExportWebViewClient.rewritePath(path, EXPORTED::contains);
    }

    @Test
    public void leavesRootAndFilesUntouched() {
        assertNull(rewrite(null));
        assertNull(rewrite(""));
        assertNull(rewrite("/"));
        assertNull(rewrite("/_next/static/chunks/main.js"));
        assertNull(rewrite("/app/planner/index.txt"));
        assertNull(rewrite("/icon-192.png"));
    }

    @Test
    public void mapsTrailingSlashRoutesToTheirOwnIndex() {
        assertEquals("/app/index.html", rewrite("/app/"));
        assertEquals("/app/planner/index.html", rewrite("/app/planner/"));
    }

    @Test
    public void mapsRoutesWithoutTrailingSlash() {
        assertEquals("/app/planner/index.html", rewrite("/app/planner"));
        assertEquals("/legacy.html", rewrite("/legacy"));
    }

    @Test
    public void fallsBackToNotFoundPageForUnknownRoutes() {
        assertEquals("/404.html", rewrite("/does-not-exist/"));
    }

    @Test
    public void leavesRequestUntouchedWhenNothingIsExported() {
        assertNull(StaticExportWebViewClient.rewritePath("/app/", p -> false));
    }
}
