import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCarts } from '../store/slices/cartsSlice';
import { Cart } from '../../core/entities/cart/Cart';

export const MainScreen: React.FC = () => {
    const state = useAppSelector((state) => state);
    console.log(state);
    const dispatch = useAppDispatch();
    const { carts, loading, error } = useAppSelector((state) => state.carts);

    useEffect(() => {
        dispatch(getCarts());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(getCarts());
    };

    const handleCartPress = (cart: Cart) => {
        Alert.alert('Cart Selected', `Cart ID: ${cart.client_id}`);
    };

    const renderCartItem = ({ item }: { item: Cart }) => (
        <TouchableOpacity
            style={styles.cartItem}
            onPress={() => handleCartPress(item)}
        >
            <View style={styles.cartHeader}>
                <Text style={styles.cartId}>Cart #{item.client_id}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>

            <View style={styles.cartDetails}>
                <Text style={styles.customerName}>
                    Customer: {item.name || 'N/A'}
                </Text>
                <Text style={styles.customerCount}>
                    People: {item.customer_count}
                </Text>
                <Text style={styles.cashier}>
                    Cashier: {item.cashier_name || 'N/A'}
                </Text>
            </View>

            <View style={styles.cartFooter}>
                <Text style={styles.totalPrice}>
                    Total: ${item.total_price?.toFixed(2) || '0.00'}
                </Text>
                <Text style={styles.itemCount}>
                    Items: {item.items?.length || 0}
                </Text>
            </View>

            {item.table && (
                <View style={styles.tableInfo}>
                    <Text style={styles.tableText}>
                        Table: {item.table.name}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'cancelled': return '#F44336';
            default: return '#2196F3';
        }
    };

    if (loading && carts.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading carts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Restaurant Orders</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={carts}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.client_id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No orders found</Text>
                        <Text style={styles.emptySubtext}>Pull to refresh or add new orders</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    refreshText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    cartItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cartId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    cartDetails: {
        marginBottom: 12,
    },
    customerName: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    customerCount: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    cashier: {
        fontSize: 14,
        color: '#777',
    },
    cartFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    itemCount: {
        fontSize: 14,
        color: '#777',
    },
    tableInfo: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
    },
    tableText: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
});
