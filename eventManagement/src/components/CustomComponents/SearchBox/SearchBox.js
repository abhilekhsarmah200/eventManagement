import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

const SearchBox = ({
  className = '',
  onChange = () => {},
  onSearch = () => {},
  setSearchProps,
  initialSearchProps,
  searchProps,
  style,
  search,
  ...restProps
}) => {
  return (
    <div className='flex w-full gap-2 justify-center align-middle p-inputgroup'>
      <div className='flex flex-col lg:flex-row gap-4 w-full items-center'>
        <div className='flex w-full'>
          <InputText
            className={`w-full transition duration-150 ease-out text-left  text-field pl-2 px-4 placeholder-gray-500 bg-primary-color-100  rounded-l ${className}`}
            placeholder='Text'
            onKeyPress={(e) => (e?.key === 'Enter' ? onSearch(e) : () => {})}
            onChange={(e) => {
              onChange(e);
            }}
            style={style}
            {...restProps}
          />
          <div
            className='rounded-md flex flex-col justify-center content-center items-center text-sm p-inputgroup-addon tooltip '
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

        <div>
          {search && (
            <div className={`card flex justify-content-center`}>
              <MultiSelect
                display='chip'
                value={searchProps}
                onChange={(e) => setSearchProps(e.value)}
                options={initialSearchProps}
                optionLabel='label'
                placeholder='Search By Category'
                maxSelectedLabels={2}
                className='w-full md:w-20rem'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
