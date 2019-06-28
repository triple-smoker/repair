package com.firstandroid;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.shahenlibrary.RNVideoProcessingPackage;
import community.revteltech.nfc.NfcManagerPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import org.reactnative.camera.RNCameraPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import java.util.Arrays;
import java.util.List;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.util.Log;
import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MainApplication extends Application implements ReactApplication {
  private static final String TAG = "Init";
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new SQLitePluginPackage(),
          new MainReactPackage(),
            new RNVideoProcessingPackage(),
            new NfcManagerPackage(),
            new RNViewShotPackage(),
            new ReactVideoPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new AsyncStoragePackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new RnPackages(),  //add
            new RNCameraPackage(),
            new ReactNativePushNotificationPackage(),
            new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this) ;
  }
  @Override
  public void onCreate() {
    super.onCreate();
    initCloudChannel(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
  /**
   * 初始化云推送通道
   * @param applicationContext
   */
  private void initCloudChannel(Context applicationContext) {
    PushServiceFactory.init(applicationContext);
    CloudPushService pushService = PushServiceFactory.getCloudPushService();
    pushService.register(applicationContext, new CommonCallback() {
      @Override
      public void onSuccess(String response) {
        WritableMap params = Arguments.createMap();
        params.putString("success", "true");
        PushModule.sendEvent("onInit", params);
        Log.d(TAG, "init cloudchannel success");
      }
      @Override
      public void onFailed(String errorCode, String errorMessage) {
        Log.d(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
        WritableMap params = Arguments.createMap();
        params.putString("success", "false");
        PushModule.sendEvent("onInit", params);
      }
    });
  }
}
