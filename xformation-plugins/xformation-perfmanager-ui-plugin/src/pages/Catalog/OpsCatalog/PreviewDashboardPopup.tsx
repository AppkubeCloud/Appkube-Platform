import * as React from 'react';
import { Modal, ModalBody } from 'reactstrap';
//import './UnimplementedFeaturePopup.css';

export class PreviewDashboardPopup extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            modal: false,
            link: "",
            images: this.props.images || [],
            sliderIndex: 0
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };

    setLink = (link: any) => {
        this.setState({
            link
        });
    };

    render() {
        const state = this.state;
        const { images, sliderIndex } = state;
        return (
            <Modal isOpen={state.modal} toggle={this.toggle} className="modal-container perfmanager-modal-container preview-dashboard-popup">
                <ModalBody style={{ maxHeight: '550px' }}>
                    <button className="nabtn-close" onClick={this.toggle}><i className="fa fa-close"></i></button>
                    <div className="slider-content">
                        {images && images.length > 0 && images.map((val: any, index: any) => {
                            if (sliderIndex === index) {
                                return (
                                    <>
                                        <button disabled={index == 0} className="nabtn-left" onClick={() => { this.setState({ sliderIndex: index - 1 }) }}><i className="fa fa-angle-left"></i></button>
                                        <div className="item-image active">
                                            <img src={val.imgUrl} alt={val.name} />
                                        </div>
                                        <button disabled={index == images.length - 1} className="nabtn-right" onClick={() => { this.setState({ sliderIndex: index + 1 }) }}><i className="fa fa-angle-right"></i></button>
                                    </>
                                )
                            }
                            else {
                                return;
                            }
                        })
                        }
                    </div>
                    <ul className="slider-buttons">
                        {images.map((val: any, index: any) => (
                            <li className={`button ${sliderIndex === index ? 'active' : ''}`} onClick={() => { this.setState({ sliderIndex: index }) }}></li>
                        )
                        )
                        }
                    </ul>
                </ModalBody>
            </Modal>
        );
    }
}