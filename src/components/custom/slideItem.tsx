import { PURPLE_IMAGES } from "../../constants/sliderImages";
import React, { useMemo } from "react";
import {
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

interface Props extends AnimatedProps<ImageProps> { 
  style?: StyleProp<ImageStyle>;
  index?: number;
  rounded?: boolean;
  source?: ImageSourcePropType;
}

export const SlideItem: React.FC<Props> = (props) => {
  const { style, index = 0, rounded = false, testID, ...animatedImageProps } = props;

  const source = useMemo(
    () => props.source || PURPLE_IMAGES[index % PURPLE_IMAGES.length],
    [index, props.source]
  );

  return (
    <Animated.View testID={testID} style={{ flex: 1 }}>
      <Animated.Image
        style={[style, styles.container, rounded && { borderRadius: 15 }]}
        source={source}
        resizeMode="cover"
        {...animatedImageProps} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
