import { Provider, connect } from 'react-redux';

export function reduxify(mapStateToProps, mapDispatchToProps?) {
    return target => (connect(mapStateToProps,mapDispatchToProps)(target) as any);
}

