package com.gps;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import android.app.Activity;
import android.content.Context;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;

public class GpsPlugin extends CordovaPlugin {

	private static final String TAG = "GpsPlugin";
	private static final String GET_POSITION_ACTION = "get_position";

	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackId) {
		Activity activity = cordova.getActivity();
		if (action.equals(GET_POSITION_ACTION)) {
		  activity.runOnUiThread(new RunnableGps());
		}
		return true;
	}

	private LocationListener mlocListener;
	private LocationManager mlocManager;
	private int found = 0;
	public class MyLocationListener implements LocationListener {

		@Override
		public void onLocationChanged(Location loc) {
			if (found == 0) {
				String text =
					"Latitud = " + loc.getLatitude() +
					"\nLongitud = " + loc.getLongitude();
		
				//Activity activity = cordova.getActivity();
			  //activity.runOnUiThread(new RunnableToast(text, Toast.LENGTH_LONG));
				Toast.makeText(cordova.getActivity().getApplicationContext(), text, Toast.LENGTH_SHORT).show();
				Log.i("GPS", text);

				found = 1;
			} else if (found == 1){
				found = 2;
				mlocManager.removeUpdates(mlocListener);
			}
		}

		@Override
		public void onProviderDisabled(String provider)	{
			Toast.makeText(cordova.getActivity().getApplicationContext(), "Gps Disabled", Toast.LENGTH_SHORT).show();
		}

		@Override
		public void onProviderEnabled(String provider) {
			Toast.makeText(cordova.getActivity().getApplicationContext(), "Gps Enabled", Toast.LENGTH_SHORT).show();
		}

		@Override
		public void onStatusChanged(String provider, int status, Bundle extras)	{
		}
	}

	class RunnableGps implements Runnable {
		Context context =  cordova.getActivity().getApplicationContext();

		public RunnableGps() {
			mlocListener = new MyLocationListener();
			mlocManager = (LocationManager)cordova.getActivity().getSystemService(Context.LOCATION_SERVICE);
		}

		@Override
		public void run() {
			found = 0;
			mlocManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, mlocListener);
		}
	}

	class RunnableToast implements Runnable {
		private String message;
		private int length;

		Context context =  cordova.getActivity().getApplicationContext();

		public RunnableToast(String message, int length) {
			this.message = message;
			this.length = length;
		}

		@Override
		public void run() {
			Toast.makeText(context, message, length).show();
		}
	}
}

/*
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

JSONObject o = new JSONObject();
try {
	o.put("latitude", loc.getLatitude());
	o.put("longitude", loc.getLongitude());
} catch (JSONException e) {
}

PluginResult result = new PluginResult(PluginResult.Status.OK, last);
             result = new PluginResult(PluginResult.Status.ERROR, obj);
callbackContext.sendPluginResult(result);

JSONObject args;
args.getBoolean(0);
args.getInt(1);
args.getString(0);

*/