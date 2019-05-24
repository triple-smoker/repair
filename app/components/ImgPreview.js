import React, {Component} from 'react';
import {
  Image,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';

let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
let dialogWidth = ScreenWidth - 80;

class ImgPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false //没用到
    }
  }
  getImageItem(imagesRequest) {
    var i = 0;
    var listItems;
    if (imagesRequest != null) {
      i = imagesRequest.length;
      listItems = (imagesRequest === null
        ? null
        : imagesRequest.map((imageItem, index) => <ImageItem num={index + 1} sum={i} imageurl={imageItem.uri} key={index}/>))
    } else {
      listItems = <View
        style={{
        width: "100%",
        height: "100%",
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: "center"
      }}>
        <Text style={{
          color: '#666',
          fontSize: 16
        }}>暂无图片</Text>
      </View>
    }
    return listItems;
  }
  render() {
    let num = typeof(this.props.PicMsg.index) == 'number'
      ? this.props.PicMsg.index
      : 0;

    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.PicMsg.visible}
        onRequestClose={this.props.setModalVisible}>
        <View style={StyleImages.container}>
          <View style={StyleImages.ViewCon}>
            <Swiper
              style={{
              width: ScreenWidth,
              height: ScreenHeight / 3
            }}
              onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
              dot={< View style = {{backgroundColor: 'rgba(0,0,0,0.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>}
              activeDot={< View style = {{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>}
              paginationStyle={{
              bottom: -23,
              left: null,
              right: 10
            }}
              loop={false}
              index={num}>
              {this.getImageItem(this.props.imagesRequest)}
            </Swiper>
          </View>
        </View>

      </Modal>
    )
  }
}

class ImageItem extends Component {
  render() {
    return (
      <View style={StyleImages.slide}>
        <Image
          resizeMode='contain'
          style={StyleImages.image}
          source={{
          uri: this.props.imageurl
        }}/>
        <View
          style={{
          position: 'relative',
          left: ScreenWidth - 70,
          top: -40,
          backgroundColor: '#545658',
          height: 22,
          paddingLeft: 2,
          width: 40,
          borderRadius: 10
        }}>
          <Text
            style={{
            color: '#fff',
            paddingLeft: 5
          }}>{this.props.num}/{this.props.sum}</Text>
        </View>
      </View>
    )
  }
}

const StyleImages = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  ViewCon: {
    width: ScreenWidth,
    height: ScreenHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width: ScreenWidth,
    flex: 1
  }
})

module.exports = ImgPreview;