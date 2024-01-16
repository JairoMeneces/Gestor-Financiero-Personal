import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';


const GastosScreen = ({ route }) => {
  const { gastos } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gastos Acumulados</Text>
      <Text style={styles.subTitle}>{`Bs ${gastos.toFixed(2)}`}</Text>
    </View>
  );
};

const AgendaScreen = ({ route }) => {
  const { setSaldo, setGastos } = route.params;
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [agendaItems, setAgendaItems] = useState([]);

  const handleAgregarMonto = () => {
    if (monto && descripcion) {
      const nuevoItem = { monto: parseFloat(monto), descripcion };

      // Actualizamos el saldo restando el monto
      setSaldo((prevSaldo) => prevSaldo - parseFloat(monto));

      // Actualizamos los gastos sumando el monto
      setGastos((prevGastos) => prevGastos + parseFloat(monto));

      // Actualizamos la agenda
      setAgendaItems((prevItems) => [nuevoItem, ...prevItems]);

      // Limpiar los campos después de agregar
      setMonto('');
      setDescripcion('');
    } else {
      console.log('Por favor, ingrese un monto y una descripción válidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agenda</Text>

      {/* Lista de elementos de la agenda */}
      <FlatList
        data={agendaItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{`Bs${item.monto.toFixed(2)} - ${item.descripcion}`}</Text>
          </View>
        )}
        inverted // Invierte la lista para mostrar los elementos más recientes arriba
      />

      {/* Formulario para ingresar monto y descripción */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ingrese el monto"
          keyboardType="numeric"
          value={monto}
          onChangeText={(text) => setMonto(text)}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={(text) => setDescripcion(text)}
        />

        <TouchableOpacity onPress={handleAgregarMonto} style={styles.addButton}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};



const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/2150/2150264.png" }} style={styles.image} />
      <Text style={styles.titulo}>Gestor Financiero</Text>
      <Text style={styles.subTitle}>Ingresa a tu cuenta o crea una</Text>
      <TouchableOpacity onPress={() => navigation.navigate('IniciarSesion')} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegistroUsuario')} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Registrarse</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const VerSaldoScreen = ({ route }) => {
  const { saldo } = route.params;
  const [currentSaldo, setSaldo] = useState(saldo);
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Saldo Actual</Text>
      <Text style={styles.subTitle}>{`Bs ${saldo.toFixed(2)}`}</Text>
    </View>
  );
};


const IniciarSesionScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInicioSesion = () => {
    console.log("Iniciando sesión con:", email, password);
    navigation.navigate('InicioSesionExitoso', { saldo: 0 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.textInput}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.textInput}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity onPress={handleInicioSesion} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const InicioSesionExitosoScreen = ({ navigation, route }) => {
  const { saldo } = route.params;
  const [currentSaldo, setSaldo] = useState(saldo);
  const [gastos, setGastos] = useState(0); // Nuevo estado para los gastos acumulados

  const handleAgregarSaldo = () => {
    navigation.navigate('AgregarSaldo', { setSaldo });
  };

  const handleVerSaldo = () => {
    navigation.navigate('VerSaldo', { saldo: currentSaldo });
  };

  const handleAgenda = () => {
    console.log("Accediendo a la Agenda...");
    navigation.navigate('Agenda', { setSaldo, setGastos }); // Pasar setGastos a la Agenda
  };

  const handleGastos = () => {
    console.log("Accediendo a la sección de Gastos...");
    navigation.navigate('Gastos', { gastos }); // Agregar una nueva pantalla de Gastos
  };

  const handleVerEstadisticas = () => {
    // Abre una URL ficticia (puedes ajustarla según tus necesidades)
    const url = 'https://www.debt.com/es/wp-content/uploads/2014/11/Personal-Finance-Statistics_Spending-Chart.webp';
    
    // Abre la URL en el navegador externo
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/2362/2362070.png" }} style={styles.successImage} />
      <Text style={styles.titulo}>¡Bienvenido de nuevo!</Text>

      <TouchableOpacity onPress={handleAgregarSaldo} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Agregar Saldo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleVerSaldo} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Ver Saldo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAgenda} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Agenda</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGastos} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Gastos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleVerEstadisticas} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Ver Estadísticas</Text>
      </TouchableOpacity>
    </View>
  );
};

const AgregarSaldoScreen = ({ navigation, route }) => {
  const { setSaldo } = route.params;
  const [monto, setMonto] = useState("");

  const handleAgregarSaldo = () => {
    console.log("Agregando saldo:", monto);
    setSaldo((prevSaldo) => prevSaldo + parseFloat(monto));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Saldo</Text>

      <TextInput
        placeholder="Monto a agregar"
        style={styles.textInput}
        keyboardType="numeric"
        onChangeText={(text) => setMonto(text)}
        value={monto}
      />

      <TouchableOpacity onPress={handleAgregarSaldo} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Agregar Saldo</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const RegistroUsuarioScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistro = () => {
    console.log("Registrando usuario:", nombre, apellido, email, password);
    navigation.navigate('InicioSesionExitoso', { saldo: 0 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Usuario</Text>

      <TextInput
        placeholder="Nombre"
        style={styles.textInput}
        onChangeText={(text) => setNombre(text)}
        value={nombre}
      />

      <TextInput
        placeholder="Apellido"
        style={styles.textInput}
        onChangeText={(text) => setApellido(text)}
        value={apellido}
      />

      <TextInput
        placeholder="Correo electrónico"
        style={styles.textInput}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.textInput}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity onPress={handleRegistro} style={styles.buttonContainer}>
        <Text style={styles.buttonStyle}>Registrarse</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const ModificarDatosScreen = ({ navigation }) => {
  // Resto del código de ModificarDatosScreen
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="IniciarSesion" component={IniciarSesionScreen} />
        <Stack.Screen name="Gastos" component={GastosScreen} />
        <Stack.Screen name="InicioSesionExitoso" component={InicioSesionExitosoScreen} />
        <Stack.Screen name="AgregarSaldo" component={AgregarSaldoScreen} />
        <Stack.Screen name="RegistroUsuario" component={RegistroUsuarioScreen} />
        <Stack.Screen name="ModificarDatos" component={ModificarDatosScreen} />
        <Stack.Screen name="VerSaldo" component={VerSaldoScreen} />
        <Stack.Screen name="Agenda" component={AgendaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 30,
    color: "#34434D",
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    color: "gray",
  },
  image: {
    height: 200,
    width: 200,
    marginTop: 15,
  },
  successImage: {
    height: 150,
    width: 150,
    marginTop: 15,
  },
  buttonContainer: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
    color: "white",
    padding: 15,
    borderRadius: 15,
    width: "80%",
    fontSize: 15,
    textAlign: "center",
  },
  textInput: {
    padding: 10,
    width: "80%",
    height: 50,
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  buttonStyle: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20, // Ajustado para dar más espacio al botón
    padding: 15,
    borderRadius: 15,
    alignSelf: 'center', // Centra el botón horizontalmente
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
});