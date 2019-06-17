
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    ScrollView,
    TouchableOpacity,
    ListView,
    Modal,
    InteractionManager
} from 'react-native';

import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairList, GetMaterialTypeTree, QueryMaterialListByTypeId, SaveMaterial} from '../../../http/Request';
import { toastShort } from '../../../util/ToastUtil';
import BaseComponent from '../../../base/BaseComponent'


export default class MaterielList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
        	productMap:new Map(),
        	tabMap:new Map(),
        	materialTypeTree:[],
            tabIndex: 0,
            modalVisible: false,
            dataLists:[],
            theme:this.props.theme,
            repairId:props.navigation.state.params.repairId,
            tabList: [],
  			carList: [],
  			dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
           
            return true//r1.isSelected !== r2.isSelected;
            }}),
            cateLists:[],
            productLists:[],
            cateSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
           
            return true//r1.isSelected !== r2.isSelected;
            }}),
            productSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
               
            return true//r1.isSelected !== r2.isSelected;
            }}),
    	}

    	
    }

   componentDidMount() {
      //this.timer = setTimeout(() => {
        //     this.setState({cateSource:this.state.cateSource.cloneWithRows(_DATA), cateLists:_DATA, });
        // }, 100);

      this.loadMaterialTypeTree();
    }


    postList() {
		var that = this;
		var list = this.state.carList;
		if (list.length === 0) {
			toastShort('请优先选择物料');
			return;
		}

		var materials = [];
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			let entity = {materialId:item.materialId, unitPrice:item.unitPrice, qty:item.nCount};
			materials.push(entity);
		}

		let params = {
			repairId:this.state.repairId,
			userId:global.uinfo.userId,
			materials:materials,
		};

    	Request.requestPost(SaveMaterial, params, (result)=> {
        	if (result && result.code === 200) {
        		toastShort('提交成功');
        		DeviceEventEmitter.emit('Event_Refresh_Detail', 'Event_Refresh_Detail');
        		this.naviGoBack(this.props.navigation);
        	} else {
          
        	}
    	});
    }


    queryMaterialListByTypeId(mid) {
		var that = this;
    	Request.requestGet(QueryMaterialListByTypeId+mid, null, (result)=> {
        	if (result && result.code === 200) {
        		console.log('new loading');
        		console.log(result.data);
        		if (result.data) {
        			var items = result.data;
        			var list = [];
        			for (var i = 0; i < items.length; i++) {
      					var item = items[i];
      					let entity = {
      						barCode:item.barCode, nCount:0, 
      						brand:item.brand, brandId:item.brandId,
      						code:item.code, materialId:item.materialId,
      						materialName:item.materialName, materialTypeId:item.materialTypeId,
      						materialTypeName:item.materialTypeName, spec:item.spec,
      						poUnit:item.poUnit, unitPrice:item.unitPrice,
      					};
      					
      					list.push(entity);
        			}

        			that.state.productMap.set(mid, list);
           			that.setState({productLists:list, productSource:that.state.productSource.cloneWithRows(list),});
        		}
        		
        	} else {
          
        	}
    	});
    }

  loadMaterialTypeTree() {
    var that = this;
    Request.requestGet(GetMaterialTypeTree, null, (result)=> {
        if (result && result.code === 200) {
            if (result.data&&result.data.length) {
				var items = result.data;
				var tabList = [];
				var map = this.state.tabMap;
      			for (var i = 0; i < items.length; i++) {
      				var item = items[i];
      				let entity = {materialTypeId:item.materialTypeId, selected:0, materialTypeName:item.materialTypeName, parentId:item.parentId};
      				if (i===0) {
      					entity.selected = 1;
      				}
      				tabList.push(entity);
      				map.set(item.materialTypeId, item);
        		}

       			var list = [];
       			var item = tabList[0];
    			var cateList = map.get(item.materialTypeId).childrenList;
    			console.log(tabList);
      			for (var i = 0; i < cateList.length; i++) {
      				var item = cateList[i];
					let entity = {materialTypeId:item.materialTypeId, selected:0, materialTypeName:item.materialTypeName, parentId:item.parentId};
      				list.push(entity);
      			}

      			if (list.length > 0) {
      				this.queryMaterialListByTypeId(list[0].materialTypeId);
      			}
      			
            	that.setState({tabMap:map, cateSource:this.state.cateSource.cloneWithRows(list), tabList:items, cateLists:list});
        	}
        } else {
          
        }
    });
  }



  onShowList() {
  	if (this.state.modalVisible) {
		this.setState({modalVisible:false});
  	} else {
  		this.setState({modalVisible:true, 
        dataSource:this.state.dataSource.cloneWithRows(this.state.carList)});
  	}
  	
  }


  _clear() {

  		var list = this.state.productLists;
  		if (list.length > 0) {
		  for (var i = 0; i < list.length; i++) {
			var item = list[i];
			item.nCount = 0;
  		  }
  		} 

  		this.setState({modalVisible:false, carList:[], productLists:list, 
  			productSource:this.state.productSource.cloneWithRows(list), dataSource:this.state.dataSource.cloneWithRows([]),});
  }


  onPressTabItem(data){
    var items = this.state.tabList;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.materialTypeId === data.materialTypeId) {
            item.selected = 1;
        } else {
            item.selected = 0;
        }

    }

    var list = [];
    var cateList = this.state.tabMap.get(data.materialTypeId).childrenList;
    console.log(cateList);
      for (var i = 0; i < cateList.length; i++) {
      	var item = cateList[i];
		let entity = {materialTypeId:item.materialTypeId, selected:0, materialTypeName:item.materialTypeName, parentId:item.parentId};
      	list.push(entity);
      }
    
    this.setState({cateSource:this.state.cateSource.cloneWithRows(list), tabList:items, cateLists:list});
}

renderTabItem(data, i) {
	var that = this;
    return (
    <TouchableOpacity key={i} onPress={()=>{that.onPressTabItem(data)}} style = {styles.itemStyle}>
    		<View style = {styles.itemStyle}>
        		<Text style={{color:data.selected===1 ?'#6DC5C9':'#777',fontSize:13, textAlign:'center', textAlignVertical:'center', flex:1, marginLeft:5,marginRight:10,}}>{data.materialTypeName}</Text>
        		<View style={{backgroundColor: data.selected===1?'#6DC5C9':'#fff', height:data.selected===1?2:0, marginLeft:5,marginRight:10, width:60}}/>
        	</View>
    </TouchableOpacity>

    );
}


  onPressCateItem(data){
  	var that = this;
      var items = this.state.cateLists;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.materialTypeId === data.materialTypeId) {
            item.selected = 1;
        } else {
            item.selected = 0;
        }

    }
    
    	if (this.state.productMap.has(data.materialTypeId)) {
        	var list = this.state.productMap.get(data.materialTypeId);
        	console.log('has cache');
        	console.log(list);
        	that.setState({cateSource:this.state.cateSource.cloneWithRows(items), cateLists:items, productLists:list, productSource:that.state.productSource.cloneWithRows(list), });
       
    	} else {
    		this.setState({cateSource:this.state.cateSource.cloneWithRows(items), cateLists:items, });
    		this.queryMaterialListByTypeId(data.materialTypeId);
    	}
    
  }

  renderCateItem(data) {
    var that = this;
    var color = data.selected===0 ? '#999' : '#444';
    var bgColor = data.selected===0 ? '#f3f3f3' : '#fbfbfb';
    var img = null;
    if (data.selected===1) {
        img = <Image source={require('../../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:10,marginRight:6,}}/>
    
    }
    return (
    <View key={data.id}>
    <TouchableOpacity onPress={()=>{this.onPressCateItem(data)}} style={{height:45,flex:1,backgroundColor: bgColor,}}>
    <View style={{flexDirection:'row',marginLeft:5,height:45,textAlignVertical:'center',alignItems: 'center',}} >
    
    <Text style={{fontSize:13,color:color,marginLeft:5, flex:1}}>{data.materialTypeName}</Text>
    {img}
    </View>
    </TouchableOpacity>

    </View>
    );
  }

  onPressProductItem(data) {

  }

  onJian(data) {
  	if (data.nCount > 0) {
		data.nCount = data.nCount-1;
  		var list = this.state.carList;
  		if (list.length > 0) {
		  for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (item.materialId === data.materialId) {
				if (item.nCount > 0) {
					item.nCount = item.nCount - 1;
				} 

				if (item.nCount === 0) {
					list.splice(i, 1);
				}
				
				break; 
			}
  		  }
  		} 

  		this.setState({carList:list, productLists:this.state.productLists, productSource:this.state.productSource.cloneWithRows(this.state.productLists),});
  	}

  }

  onInc(data) {
  	data.nCount = data.nCount+1;
  	var list = this.state.carList;
  	var add = 0;
  	if (list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (item.materialId === data.materialId) {
				item.nCount = item.nCount + 1;
				add = 1;
				break; 
			}
  		}
  	} 

  	if (add === 0) {
  		let entity = {
      						barCode:data.barCode, nCount:1, 
      						brand:data.brand, brandId:data.brandId,
      						code:data.code, materialId:data.materialId,
      						materialName:data.materialName, materialTypeId:data.materialTypeId,
      						materialTypeName:data.materialTypeName, spec:data.spec,
      						poUnit:data.poUnit, unitPrice:data.unitPrice,
      					};
      	list.push(entity);
  	}

  	this.setState({carList:list, productLists:this.state.productLists, productSource:this.state.productSource.cloneWithRows(this.state.productLists),});
  }

  renderProductItem(data) {
    var that = this;
    var jianImg = null;
    var price = null;
    if (data.nCount !== 0) {
    	jianImg = <TouchableOpacity onPress={()=>{that.onJian(data)}} style={{}}>
    				<Image source={require('../../../../res/repair/Inp_minus.png')} style={{width:18,height:18, marginRight:10,}}/>
    				</TouchableOpacity>
    	price = <Text style={{fontSize:14,color:'#555',marginLeft:0,marginRight:10,marginTop:0,}}>{data.nCount}</Text>
    }
    return (
    <TouchableOpacity onPress={()=>{that.onPressProductItem(data)}} style={{width:Dimens.screen_width*2/3,flex:1}}>
    	<View style={{marginLeft:0,alignItems: 'center',paddingTop:10,paddingBottom:10,}} >
    		<View style={{width:Dimens.screen_width*2/3, flexDirection:'row',}}>
    		<Text style={{fontSize:14,color:'#333',marginLeft:15,marginRight:0,marginTop:0,textAlign:'left',}}>{data.materialName}</Text>
    		</View> 
    		<View style={{width:Dimens.screen_width*2/3, flexDirection:'row',}}>
    			<Text style={{fontSize:12,color:'#999',marginLeft:15,marginRight:10,marginTop:5,}}>规格：{data.spec}</Text>
    			<Text style={{fontSize:12,color:'#999',marginLeft:15,marginRight:10,marginTop:5,}}>品牌：{data.brand}</Text>
    		</View> 
    		<View style={{width:Dimens.screen_width*2/3, flexDirection:'row', flex:1, marginTop:6,}}>
    			<Text style={{fontSize:14,color:'#EA6060',marginLeft:15,marginRight:10,marginTop:5,flex:1}}>¥{data.unitPrice}</Text>
    			<View style={{backgroundColor:'#fff', flexDirection:'row', justifyContent:'flex-end', alignItems:'center',marginLeft:15,}}>
    				{jianImg}
    				{price}
    				<TouchableOpacity onPress={()=>{that.onInc(data)}} style={{}}>
    				<Image source={require('../../../../res/repair/Inp_add.png')} style={{width:18,height:18, marginRight:10,}}/>
    				</TouchableOpacity>
    			</View>
    		</View>

    		
    	</View>
    </TouchableOpacity>
    );
   }

  onDecre(data) {
  	if (data.nCount > 0) {
		var carList = this.state.carList;
  		for (var i = 0; i < carList.length; i++) {
			var item = carList[i];
			if (item.materialId === data.materialId) {
				if (item.nCount > 0) {
					item.nCount = item.nCount - 1;
				} 

				if (item.nCount === 0) {
					carList.splice(i, 1);
				}
				
				break; 
			}
  		}

  		var list = this.state.productLists;
  		if (list.length > 0) {
		  for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (item.materialId === data.materialId) {
				if (item.nCount > 0) {
					item.nCount = item.nCount - 1;
				} 
				
				break; 
			}
  		  }
  		} 

  		this.setState({carList:carList, productLists:list, 
  			productSource:this.state.productSource.cloneWithRows(list),dataSource:this.state.dataSource.cloneWithRows(carList),});
  	}

  }

  onIncre(data) {
  	data.nCount = data.nCount+1;
  	var list = this.state.productLists;
  	var add = 0;
  	if (list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (item.materialId === data.materialId) {
				item.nCount = item.nCount + 1;
				add = 1;
				break; 
			}
  		}
  	} 

  	this.setState({carList:this.state.carList, productLists:list, 
  			productSource:this.state.productSource.cloneWithRows(list),dataSource:this.state.dataSource.cloneWithRows(this.state.carList),});
  }

  onPressItem(data){

  }

  renderItem(data) {
    var that = this;
    return (
    <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
    	<Text style={{fontSize:14,color:'#777',marginLeft:15, flex:1}}>{data.materialName}</Text>
    	<View style={{backgroundColor:'#fff', flexDirection:'row', justifyContent:'flex-end', alignItems:'center',marginLeft:15,}}>
    				<Text style={{fontSize:14,color:'#EA6060',marginLeft:15,marginRight:15,}}>¥{data.unitPrice*data.nCount}</Text>
    				<TouchableOpacity onPress={()=>{that.onDecre(data)}} style={{}}>
    				<Image source={require('../../../../res/repair/Inp_minus.png')} style={{width:18,height:18, marginRight:10,}}/>
    				</TouchableOpacity>
    				<Text style={{fontSize:14,color:'#555',marginLeft:0,marginRight:10,marginTop:0,}}>{data.nCount}</Text>
    				<TouchableOpacity onPress={()=>{that.onIncre(data)}} style={{}}>
    				<Image source={require('../../../../res/repair/Inp_add.png')} style={{width:18,height:18, marginRight:10,}}/>
    				</TouchableOpacity>
    	</View>
    </View>
    </TouchableOpacity>
    );
}

  render() {
  	var totalPrice = 0;
  	var carList = this.state.carList;
  		for (var i = 0; i < carList.length; i++) {
			var item = carList[i];
			totalPrice = totalPrice + item.nCount*item.unitPrice;
  		}

  	var tabViews = this.state.tabList.map((item, i)=>this.renderTabItem(item,i));
    return (
      <View style={styles.container}>
        <TitleBar
            centerText={'添加物料'}
            isShowLeftBackIcon={true}
            navigation={this.props.navigation}
           />
         <View style={{height:40,width:Dimens.screen_width,}}>
        <ScrollView keyboardDismissMode={'on-drag'} style={styles.scrollViewStyle} horizontal={true} showsHorizontalScrollIndicator={false}>
          {tabViews}
        </ScrollView>
         </View>
                
        <View style={styles.line}/>

        <View style={{width:Dimens.screen_width, flex:1, flexDirection:'row',}}>
            <View style={{width:Dimens.screen_width/3,}}>
        	<ListView
                initialListSize={1}
                dataSource={this.state.cateSource}
                renderRow={(item) => this.renderCateItem(item)}
                style={{backgroundColor:'#f6f6f6', width:Dimens.screen_width/3,}}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView2(sectionID, rowID, adjacentRowHighlighted)}/>
            </View>
            <View style={{width:Dimens.screen_width*2/3, flex:1, }}>
            <TouchableOpacity onPress={()=>{this.onShowList()}} style={{height:40, width:Dimens.screen_width*2/3}}>
            <View style={{backgroundColor:'#fff', flexDirection:'row', justifyContent:'flex-end', height:40, alignItems:'center', width:Dimens.screen_width*2/3}}>
            	<Image source={require('../../../../res/repair/ico_sx.png')} 
                style={{width:18,height:14,marginRight:5,}}/>
                <Text style={{fontSize:14, color:'#777', marginLeft:0, marginRight:10, }}>筛选</Text>
            </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#f6f6f6',width:Dimens.screen_width*2/3, height:1, }}/>
            <ListView
                initialListSize={1}
                dataSource={this.state.productSource}
                renderRow={(item) => this.renderProductItem(item)}
                style={{backgroundColor:'#fff', width:Dimens.screen_width*2/3,flex:1}}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView1(sectionID, rowID, adjacentRowHighlighted)}/>
                
             </View>
        </View>


	<View style={styles.bottomStyle}>
		<TouchableOpacity onPress={()=>{this.onShowList()}} style={{height:49,flex:1}}>
		<View style={{backgroundColor:'#EFF0F1', flexDirection:'row',textAlignVertical:'center',alignItems:'center',flex:1}}>
			<Image source={require('../../../../res/repair/ic_wl.png')} 
                style={{width:77,height:49,marginLeft:15, marginTop:-15, marginRight:10,}}/>
            <View>
            <Text  style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#000',fontSize:20, textAlign:'center', flex:1}}>¥{totalPrice}</Text>
			<Text  style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#000',fontSize:12, textAlign:'center', }}>物料合计</Text>
			</View>
		</View>
        </TouchableOpacity>
        <Text onPress={()=>{this.postList()}} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', width:150}}>完成</Text>
    </View>

    <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
                    <View style={styles.topStyle}>
                        <Text style={{color:'#9b9b9b', marginLeft:10, flex:1}}>已选物料</Text>
                        <TouchableOpacity onPress={()=>this._clear()}  style={{flexDirection:'row', }}>
                        <Image source={require('../../../../res/repair/ico_yb_xq.png')} style={{width:17,height:17,marginTop:5,}}/>
                        <Text style={{color:'#9b9b9b', marginLeft:5, marginRight:10, }}>清空</Text>
                        </TouchableOpacity>
                    </View>

                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource}
                        renderRow={(item) => this.renderItem(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}
                        />

                <View style={styles.bottomStyle2}>
				<TouchableOpacity onPress={()=>{this.onShowList()}} style={{height:49,flex:1}}>
				<View style={{backgroundColor:'#EFF0F1', flexDirection:'row',textAlignVertical:'center',alignItems:'center',flex:1}}>
					<Image source={require('../../../../res/repair/ic_wl.png')} 
                		style={{width:77,height:49,marginLeft:15, marginTop:-15, marginRight:10,}}/>
            	<View>
            	<Text  style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#000',fontSize:20, textAlign:'center', flex:1}}>¥{totalPrice}</Text>
				<Text  style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#000',fontSize:12, textAlign:'center', marginBottom:3}}>物料合计</Text>
				</View>
				</View>
        		</TouchableOpacity>
        		<Text onPress={()=>{this.postList()}} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', width:150}}>完成</Text>
    		</View>
        </View>
    </Modal> 

    </View>
    )
  }



  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
      );
  }

    _renderSeparatorView1(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
      );
  }

    _renderSeparatorView2(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
      );
  }





}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },

    scrollViewStyle:{
        backgroundColor: '#fff',
       	height:40,
       	width:Dimens.screen_width,
    },
    modelBgStyle:{
    	bottom:49,
    	height:Dimens.screen_height-49,
    	width:Dimens.screen_width,
    	backgroundColor: 'rgba(0,0,0,0.5)',
    	alignItems:'center',justifyContent:'center',
    },
    itemStyle:{
        backgroundColor: '#fff',
       	height:40,
       	alignItems:'center',
    	justifyContent:'center',
    	textAlignVertical:'center',
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-0),marginTop:0,marginLeft:0,
    },
    bottomStyle:{
    width:Dimens.screen_width,
    height:49,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
    flexDirection:'row',
  },
  bottomStyle2:{
    width:Dimens.screen_width,
    height:49,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    flexDirection:'row',
  },
 modelStyle:{
    width:Dimens.screen_width,
    height:384,
    color:'rgba(0, 0, 0, 0.6)',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
   
  },
  topStyle: {
        flexDirection:'row',
        fontSize:14,
        backgroundColor: '#EFF0F1',
        width:Dimens.screen_width,
        height:35,
        alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    },

  separator: {
     height: 0.5,
     backgroundColor: '#eee'
 }
});