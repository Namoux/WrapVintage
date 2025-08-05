export class ContactModel {
    constructor(connection) {
        this.connection = connection;
    }

    async saveMessage({ name, email, subject, message }) {
        await this.connection.execute(
            'INSERT INTO contactMessage (name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, NOW())',
            [name, email, subject, message]
        );
    }

    async getAllMessages() {
        const [rows] = await this.connection.execute(
            'SELECT * FROM contactMessage ORDER BY createdAt DESC'
        );
        return rows;
    }
}