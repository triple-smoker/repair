package com.firstandroid;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * 原生模块
 */
public class ToastModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    public ToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     *
     * @return js调用的模块名
     */
    @Override
    public String getName() {
        return "ToastModule";
    }

    /**
     * 使用ReactMethod注解，使这个方法被js调用
     * @param message 文本
     * @param duration 时长
     */
    @ReactMethod
    public void show(String message, int duration) {
        try {

            Toast.makeText(getReactApplicationContext(), message, duration).show();
        }
        catch (Exception e){

        }
    }
}
