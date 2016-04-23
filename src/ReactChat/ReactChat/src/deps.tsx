﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path='../typings/browser.d.ts'/>
import * as React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

var ignoreStore = createStore((state) => ({}));
var ignoreProvider = () => <Provider />;

@connect()
class Deps extends React.Component<any, any> {
    render() {
        return <div>Hello, World!</div>;
    }
}

const ignore = () => render(<Deps/>, document.body);