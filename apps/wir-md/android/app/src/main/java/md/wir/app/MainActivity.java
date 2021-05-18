package md.wir.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    registerPlugin(com.capacitorjs.plugins.app.AppPlugin.class);
    registerPlugin(com.capacitorjs.plugins.device.DevicePlugin.class);
    registerPlugin(com.capacitorjs.plugins.camera.CameraPlugin.class);
    registerPlugin(com.capacitorjs.plugins.filesystem.FilesystemPlugin.class);
    registerPlugin(com.capacitorjs.plugins.camera.CameraPlugin.class);
  }
}
