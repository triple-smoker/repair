/* tslint:disable:no-console */
import React from 'react';
import { TextareaItem,} from '@ant-design/react-native';

export default class BasicTextAreaItemExample extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            val: '默认带value',
        };
    }


    render() {
        return (
            <TextareaItem rows={4} placeholder="固定行数" />
        );
    }
}
