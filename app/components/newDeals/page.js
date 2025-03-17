import React from 'react';

const NewDeals = () => {
    const deals = [
        { id: 1, name: 'Deal 1', description: 'Description for deal 1' },
        { id: 2, name: 'Deal 2', description: 'Description for deal 2' },
        { id: 3, name: 'Deal 3', description: 'Description for deal 3' },
    ];

    return (
        <div>
            <h1>New Deals</h1>
            <ul>
                {deals.map(deal => (
                    <li key={deal.id}>
                        <h2>{deal.name}</h2>
                        <p>{deal.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewDeals;