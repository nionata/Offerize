import React from 'react';
import { Modal } from 'antd';

const CreateOfferModal = (props) => {
    return (
        <Modal
            visible={props.showModal}
            onCancel={() => {
                return props.setShowModal(false);
            }}
            title={
                <div style={{ textAlign: 'center' }}>
                    Create an offer
                </div>
            }>

        </Modal>
    )
}

export default CreateOfferModal;