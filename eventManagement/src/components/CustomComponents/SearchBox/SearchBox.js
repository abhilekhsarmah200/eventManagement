import { InputText } from 'primereact/inputtext';
import React from 'react';

const SearchBox = ({
  className = '',
  onChange = () => {},
  onSearch = () => {},
  style,
  ...restProps
}) => {
  return (
    <div className='flex w-full align-middle p-inputgroup'>
      <InputText
        className={` w-full transition duration-150 ease-out text-left text-gray-600 text-field pl-2 px-4 placeholder-gray-500 bg-primary-color-100 text-gray-600 rounded-l ${className}`}
        placeholder='Text'
        onKeyPress={(e) => (e?.key === 'Enter' ? onSearch(e) : () => {})}
        onChange={(e) => {
          onChange(e);
        }}
        style={style}
        {...restProps}
      />
      <div
        className='rounded-l flex flex-col justify-center content-center items-center text-sm p-inputgroup-addon tooltip '
        data-tooltip='Search'
        style={style}
      >
        <i
          className='pi pi-search text-primary cursor-pointer'
          style={{ fontSize: '1.5rem', color: '#472967' }}
          onClick={(e) => {
            onSearch(e);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBox;
