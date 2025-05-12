package com.daddyauden.cityseeker;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.facebook.react.ReactFragmentActivity;

import android.content.res.Configuration;
import android.content.Intent;
import android.os.Bundle;

public class MainActivity extends ReactFragmentActivity {
    @Override
    protected String getMainComponentName() {
        return "cityseeker";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
