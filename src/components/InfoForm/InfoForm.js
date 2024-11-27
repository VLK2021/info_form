import React from 'react';
import {useForm} from 'react-hook-form';

import styles from './InfoForm.module.css';


const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;


const InfoForm = () => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        const message = `
      📋 Нова інформація:
      - Повне ім'я: ${data.fullName}
      - Дата народження: ${data.birthYear || 'Не вказано'}
      - Дата смерті: ${data.deathYear || 'Не вказано'}
      - Інформація: ${data.info || 'Не вказано'}
      - Хто надав інформацію: ${data.person || 'Не вказано'}
    `;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                }),
            });

            alert('Дані успішно відправлені до Telegram!');
            reset();
        } catch (error) {
            console.error('Помилка при відправці:', error);
            alert('Не вдалося відправити дані.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}>
                    <label>Повне ім'я(ІПБ):</label>
                    <input
                        type="text"
                        {...register('fullName', {required: 'Це поле обов\'язкове'})}
                        className={errors.fullName && styles.error}
                    />
                    {errors.fullName && <span>{errors.fullName.message}</span>}
                </div>

                <div className={styles.field}>
                    <label>Дата народження:</label>
                    <input type="text"{...register('birthYear')}/>
                </div>

                <div className={styles.field}>
                    <label>Дата смерті (якщо є):</label>
                    <input type="text" {...register('deathYear')} />
                </div>

                <div className={styles.field}>
                    <label>Інформація:</label>
                    <textarea
                        {...register('info', {maxLength: {value: 5000, message: 'Максимум 5000 символів'}})}
                        className={errors.info && styles.error}
                    />
                    {errors.info && <span>{errors.info.message}</span>}
                </div>

                <div className={styles.field}>
                    <label>Хто надав інформацію:</label>
                    <input
                        type="text"
                        {...register('person', {required: 'Це поле обов\'язкове'})}
                        className={errors.fullName && styles.error}
                    />
                    {errors.person && <span>{errors.person.message}</span>}
                </div>

                <button type="submit" className={styles.submitBtn}>Відправити</button>
            </form>
        </div>
    );
};

export {InfoForm};
