import React from 'react'

function Traits({ traits, collectionSlug }) {
    const handleNavigate = (traitValue) => {
        window.location.href = `/collections/${collectionSlug}?search=${encodeURIComponent(traitValue)}&filter=trait`;
    };

    return(
        <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-50 sm:grid-cols-2 md:grid-cols-3 border-gray-900/5 border-2 rounded">
            {traits.map((trait, index) => (
                <div
                    key={index+trait.trait_type+trait.value}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white hover:bg-gray-100 px-4 py-10 sm:px-6 xl:px-8 cursor-pointer"
                    onClick={() => handleNavigate(trait.value)}
                >
                <dt className="text-sm font-medium leading-6 text-gray-500">{trait.trait_type}</dt>
                <dd
                    className={'text-gray-700'}
                >
                    {trait.rarity}
                </dd>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                    {trait.value}
                </dd>
                </div>
            ))}
        </dl>
    )
}

export default Traits