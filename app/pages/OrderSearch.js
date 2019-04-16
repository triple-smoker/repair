import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Alert,
    TextInput
} from 'react-native';
import {Row, Col, Container, Content, Text ,Button } from 'native-base';
import OrderItem from './publicTool/OrderItem';



let ScreenWidth = Dimensions.get('window').width;
class OrderOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
        searchContext: '',
        searchType: false,
        };
      }
    _setSerachContext(context){
        this.setState({searchContext:context});
    }
    _setSerachShow(context){
        this.setState({searchType:true});
        this.setState({searchContext:context});
        Alert.alert(context);
    }


  render() {
    return (
        <Container style={{backgroundColor:'#f8f8f8'}}>
            <Content>
                <Row>
                    <Button style={{width:'5%',height:40,backgroundColor:'#000'}}></Button>
                    <TextInput style={{width:'80%',height:40,fontSize:16,backgroundColor:'#999',borderRadius:15,paddingLeft:20}} onChangeText={(searchContext) => this.setState({searchContext})}>{this.state.searchContext}</TextInput>
                    <Button style={{width:'15%',height:40}} onPress={()=>this._setSerachShow(this.state.searchContext)}><Text>搜索</Text></Button>
                </Row>
                {this.state.searchType==false &&
                    <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                        <SearchItem getSearch={()=>this._setSerachShow('aaaaa')} searchContext='aaaaa'/>
                        <SearchItem getSearch={()=>this._setSerachShow('bbbb')} searchContext='bbbb'/>
                        <SearchItem getSearch={()=>this._setSerachShow('aacccaaa')} searchContext='aacccaaa'/>
                        <SearchItem getSearch={()=>this._setSerachShow('dddd')} searchContext='dddd'/>
                        <SearchItem getSearch={()=>this._setSerachShow('eee')} searchContext='eee'/>
                        <SearchItem getSearch={()=>this._setSerachShow('ffff')} searchContext='ffff'/>
                        <SearchItem getSearch={()=>this._setSerachShow('mm')} searchContext='mm'/>
                    </View>
                }
                {this.state.searchType==true &&
                    <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                        <Col>
                            <OrderItem   type={1}/>
                            <OrderItem   type={2}/>
                        </Col>
                    </View>
                }

            </Content>
        </Container>
    );
  }
}

class SearchItem extends Component{
    render(){
        return (
            <Button style={{height:30,marginLeft:20,marginTop:20,backgroundColor:'#ccc',borderRadius:15}}
            onPress={this.props.getSearch}
            >
                <Text style={{color:'#555'}}>{this.props.searchContext}</Text>
            </Button>
        )
    }
}



module.exports=OrderOne;