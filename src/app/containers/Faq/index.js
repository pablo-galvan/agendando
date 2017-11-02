'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { getFaq } from '../../actions';
import Loader from '../../components/Loader';
import FaqTab from '../../components/FaqTab';

@connect((store) => {
    return {
        faq: store.data.faq
    };
})
class Faq extends React.Component {
    constructor(props) {
        super(props);
        this.props.dispatch(getFaq());
    }

    render() {
        if (typeof this.props.faq === 'undefined') {
            return <Loader />;
        }

        return (
            <div>
                {this.props.faq.map((v, k) => {
                    return (
                        <FaqTab 
                            key={k}
                            id={v.faq.id}
                            title={v.faq.question} 
                            description={v.faq.answer} 
                        />
                    );
                })}
            </div>
        );
    }
};

export default Faq;