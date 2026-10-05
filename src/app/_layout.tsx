import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const _layout = () => {
  type Message = {
    id: number,
    message: string,
    reply: string
  };
  
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState <Message []>([]);
  
  

  const baseUrl = 'http://10.64.44.39:8000';

  const onSendMessage = async() => {
    if(!inputText.trim()) return;

    const currentMessage = inputText;

    const tempMessage = {
      id: Date.now(),
      message: currentMessage,
      reply: 'Typing...'
    };
    setData(prev => [...prev, tempMessage]);
    setInputText('');

    try {
      const response = await fetch(`${baseUrl}/chat`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 1,
          message: currentMessage
        })
      });
      const text = await response.text();
      console.log('/chat reponse', text);
      
      let result;
       try {
         result = JSON.parse(text);
       } catch (error) {
        throw new Error('Invalid json from server');
       }
       setData(prev => prev.map((item) => item.id == tempMessage.id? {
        ...item,
        reply: result.reply || 'no reply'
       }: item
      ));

    } catch (error) {
      console.log(error);
      setData(prev => prev.map((item) => item.id == tempMessage.id? {
        ...item,
        reply: 'server error'
       }: item
      ));
    }

  }

  return (
    <View style= {{flex: 1, marginVertical: 30, marginHorizontal: 20}} >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <View style={{alignSelf:'flex-end', paddingVertical:10, maxWidth: '75%'}} >
              <Text>{item.message}</Text>
            </View>
             <View style={{alignSelf:'flex-start', paddingVertical:10, maxWidth: '75%'}}>
              <Text>{item.reply}</Text>
            </View>
          </View>
        )}
        />
      <View style={{flexDirection: 'row' , position:'absolute', bottom:10, alignItems:'center' , width: '100%' , borderColor: '#191919', borderRadius: 50, borderWidth: 1, height:50 }} > 
        <TextInput
        placeholder='Type message...'
        style={{marginLeft:10}}
        onChangeText={setInputText}
        value={inputText}
        />
        <TouchableOpacity style= {{position:'absolute', right:10}} onPress={onSendMessage}>
          <Ionicons name='send' size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default _layout