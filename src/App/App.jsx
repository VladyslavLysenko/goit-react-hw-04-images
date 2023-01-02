import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Toaster } from 'react-hot-toast';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import { Modal } from '../components/Modal/Modal';
import { Button } from '../components/Button/Button';
import { AppDiv } from './App.styled';
import { GlobalStyle } from 'GlobalStyle';
import api from '../Fetch/Fetch';

import toast from 'react-hot-toast';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [photoName, setPhotoName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [largeImgData, setLargeImgData] = useState({ src: '', alt: '' });
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(Status.IDLE);
  const [showLoadMore, setshowLoadMore] = useState(false);
  const perPage = 12;

  useEffect(() => {
    console.log('useEffect', photoName, page);
    if (photoName !== '') {
      fetchPhotos(photoName, page);
    }
  }, [photoName, page]);

  const fetchPhotos = (nextName, nextPage) => {
    setStatus(Status.PENDING);

    api
      .fetchPhotos(nextName, nextPage, perPage)
      .then(response => {
        const pages = Math.ceil(response.totalHits / perPage);

        const showLoadMore = page < pages;

        setshowLoadMore(showLoadMore);

        if (response.hits.length === 0) {
          toast.error('Sorry,we did not find...');
          setStatus(Status.IDLE);
        } else {
          const photoApiArr = [];

          response.hits.map(item =>
            photoApiArr.push({
              id: item.id,
              webformatURL: item.webformatURL,
              largeImageURL: item.largeImageURL,
              tags: item.tags,
            })
          );

          setPhotos([...photos, ...photoApiArr]);
          setStatus(Status.RESOLVED);
          autoScroll();
        }
      })
      .catch(() => {
        setStatus(Status.REJECTED);
        toast.error('Ups... Something is wrong.', {
          duration: 4000,
          position: 'top-center',
        });
      });
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const autoScroll = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = photoName => {
    setPhotoName(photoName);
    setPhotos([]);
    setPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const shereSrcForModal = (srcLarge, altLarge) => {
    setLargeImgData({ src: srcLarge, alt: altLarge });
  };

  return (
    <AppDiv>
      <GlobalStyle />
      {showModal && (
        <Modal
          src={largeImgData.src}
          alt={largeImgData.alt}
          onClose={toggleModal}
        />
      )}
      <Toaster />
      <SearchBar onSubmit={handleFormSubmit} />
      <ImageGallery
        photos={photos}
        status={status}
        onImgClick={toggleModal}
        shereSrcForModal={shereSrcForModal}
      />

      {status === Status.RESOLVED && showLoadMore && (
        <Button type="button" onClick={loadMore} />
      )}
    </AppDiv>
  );
};
