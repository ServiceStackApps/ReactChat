import { Provider, connect } from 'react-redux';

//React Redux @connect() is no longer usable as an annotation, @reduxify wraps and strips types to allow
export function reduxify(mapStateToProps, mapDispatchToProps?, mergeProps?, options?) {
    return target => (connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(target) as any);
}

