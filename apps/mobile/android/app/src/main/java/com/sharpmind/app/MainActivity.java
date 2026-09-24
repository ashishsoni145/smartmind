package com.sharpmind.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (bridge != null) {
            // Serve Next.js static-export routes (e.g. /app/planner/) from their own index.html.
            bridge.setWebViewClient(new StaticExportWebViewClient(bridge));
        }
    }
}
