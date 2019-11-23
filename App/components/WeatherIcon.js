////////////////////////////////////////////////////////////////////////////////////////
//////////////////// Not my code, code by Spencer Carli ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { View, Image } from "react-native";

import { getWeatherIcon } from "../util/icons";

export const WeatherIcon = ({ icon, tint }) => (
  <View style={{ alignItems: "center" }}>
    <Image
      source={getWeatherIcon(icon)}
      style={[{ width: 200, height: 200 }, tint]}
      resizeMode="contain"
    />
  </View>
);
