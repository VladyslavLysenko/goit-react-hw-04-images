import { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './SearchBar.styled';


export const SearchBar = ({ onSubmit }) => {
  const [photoName, setPhotoName] = useState('');

  const handleNameChange = event => {
    setPhotoName(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (photoName.trim() === '') {
      toast('Уведіть назву для пошуку фото...');
      return;
    }
    onSubmit(photoName);
    setPhotoName('');
  };

  return (
    <SearchbarHeader className="searchbar">
      <SearchForm onSubmit={handleSubmit} className="form">
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>

        <SearchFormInput
          onChange={handleNameChange}
          value={photoName}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarHeader>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
