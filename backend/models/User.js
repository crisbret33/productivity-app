const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Necesitas instalar esta librería
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya dos usuarios con el mismo correo
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    boards: [{ // Opcional: Referencia a los tableros de los que es miembro.
        type: Schema.Types.ObjectId,
        ref: 'Board'
    }]
}, {
    timestamps: true // Añade 'createdAt' y 'updatedAt'
});

// --- Métodos de Instancia ---
// 1. Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Compara la contraseña ingresada con la contraseña hasheada guardada
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Middleware Pre-Guardado ---
// 2. Encriptar la contraseña antes de guardarla (si ha sido modificada)
userSchema.pre('save', async function (next) {
    // Solo hashea si el campo password ha sido modificado
    if (!this.isModified('password')) {
        next();
    }

    // Generar el salt y el hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);