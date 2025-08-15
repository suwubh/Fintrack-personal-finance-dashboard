import React, { useEffect, useState } from 'react';
import { authFetch, handleError } from '../utils';

function Expenses() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const res = await authFetch('/expenses', { method: 'GET' });
                const data = await res.json();

                if (data.success) {
                    setExpenses(data.data);
                } else {
                    handleError(data.message || 'Failed to fetch expenses');
                }
            } catch (err) {
                handleError('Error fetching expenses');
                console.error(err);
            }
        };

        loadExpenses();
    }, []);

    return (
        <div>
            <h1>Your Expenses</h1>
            {expenses.length > 0 ? (
                <ul>
                    {expenses.map((exp, i) => (
                        <li key={i}>{exp.description} - ${exp.amount}</li>
                    ))}
                </ul>
            ) : (
                <p>No expenses found</p>
            )}
        </div>
    );
}

export default Expenses;
