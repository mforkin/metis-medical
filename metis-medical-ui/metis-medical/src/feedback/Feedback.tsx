import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

class Feedback extends React.Component {
    constructor (props, context) {
        super(props, context);
    }

    public render () {
        const iframe = '<iframe ' +
                    'src="https://docs.google.com/forms/d/e/1FAIpQLSfDdGA_e3wj1xOE6frgypSL7TLCm6Vxm32sgb18EHFwnZU4uQ/viewform?embedded=true&entry.564145211=' + _.get(this.props, 'content.userInfo.user.username') + '" ' +
                    'width="640" ' +
                    'height="974" ' +
                    'frameborder="0" ' +
                    'marginheight="0" ' +
                    'marginwidth="0"> ' +
                        'Loading…' +
                '</iframe>'
        return (
            <div className="feedback-cnt">
                <div dangerouslySetInnerHTML={{__html: iframe}} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        content: _.get(state, 'content'),
        results: _.get(state, 'results'),
        specialties: _.get(state, 'specialties')
    };
}

export default connect(mapStateToProps)(Feedback);