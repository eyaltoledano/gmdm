import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Api from '../../services/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NftDropdown({ onNftSelected, collectionSlug }) {
  const [query, setQuery] = useState('');
  const [selectedNft, setSelectedNft] = useState(null);
  const [nfts, setNfts] = useState([]);

  const debounce = (mainFunction, delay) => {
    // Declare a variable called 'timer' to store the timer ID
    let timer;
  
    // Return an anonymous function that takes in any number of arguments
    return function (...args) {
      // Clear the previous timer to prevent the execution of 'mainFunction'
      clearTimeout(timer);
  
      // Set a new timer that will execute 'mainFunction' after the specified delay
      timer = setTimeout(() => {
        mainFunction(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const fetchNfts = async () => {
      let apiPath = '/api/v1/nfts'; // Default path to fetch user's NFTs
      if (collectionSlug) {
        // Adjust the path to include search query if collectionSlug is provided
        apiPath = `/api/v1/collections/${collectionSlug}/nfts?search=${encodeURIComponent(query)}`;
      }
  
      try {
        const response = await Api.get(apiPath);
        setNfts(response);
        if (response && response.length > 0) {
          setSelectedNft(response[0]); // Default to first NFT if available
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };
  
    const debounceFetchNfts = debounce(fetchNfts, 300); // Debounce to limit API requests while typing
    debounceFetchNfts();
  }, [collectionSlug, query]);  

  useEffect(() => {
    onNftSelected(selectedNft);
  }, [selectedNft, onNftSelected]);

  const filteredNfts = query === '' ? nfts : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox as="div" value={selectedNft} onChange={setSelectedNft}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Select NFT</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(nft) => nft?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredNfts.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredNfts.map((nft) => (
              <Combobox.Option
                key={nft.id}
                value={nft}
                className={({ active }) =>
                  classNames('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900')}
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img src={nft.image_url} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                      <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>{nft.name}</span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
