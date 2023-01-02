import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalDiv } from './Modal.styled';

export const Modal = ({ src, alt, onClose }) => {
  const handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Overlay
      onClick={() => {
        onClose();
      }}
    >
      <ModalDiv>
        <img src={src} alt={alt} />
      </ModalDiv>
    </Overlay>
  );
};
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
