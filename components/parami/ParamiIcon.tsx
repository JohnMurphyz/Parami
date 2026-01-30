import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface ParamiIconProps {
  paramiId: number;
  size?: number;
}

// Map each Parami to its image
const PARAMI_IMAGES: Record<number, any> = {
  1: require('../../assets/dana-image.jpg'),
  2: require('../../assets/sila-image.webp'),
  3: require('../../assets/renunciation-image.jpg'),
  4: require('../../assets/wisdom-image.jpeg'),
  5: require('../../assets/energy-image.webp'),
  6: require('../../assets/patience-image.jpg'),
  7: require('../../assets/truthfulness-image.jpeg'),
  8: require('../../assets/strongdetermination-image.webp'),
  9: require('../../assets/metta-image.jpg'),
  10: require('../../assets/equanimity-image.jpg'),
};

const ParamiIcon = React.memo(({ paramiId, size = 200 }: ParamiIconProps) => {
  const imageSource = PARAMI_IMAGES[paramiId];

  return (
    <Image
      source={imageSource}
      style={[
        styles.image,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      resizeMode="cover"
    />
  );
});

export default ParamiIcon;

const styles = StyleSheet.create({
  image: {
    borderWidth: 3,
    borderColor: '#E8E4DD20',
  },
});
