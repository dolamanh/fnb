import React, { useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCarts } from '../store/slices/cartsSlice';
import { Cart } from '../../core/entities/cart/Cart';
import { useTranslation } from '../i18n/hooks';
import { BaseText } from '../components/base/BaseText';
import { BaseButton } from '../components/base/BaseButton';
import { BaseCard } from '../components/base/BaseCard';
import { BaseLoading } from '../components/base/BaseLoading';
import { LanguageButton } from '../components/base/LanguageButton';

export const MainScreen: React.FC = () => {
    const state = useAppSelector((state) => state);
    console.log(state);
    const dispatch = useAppDispatch();
    const { carts, loading, error } = useAppSelector((state) => state.carts);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getCarts());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(getCarts());
    };

    const handleCartPress = (cart: Cart) => {
        Alert.alert(t('carts.cartSelected'), `${t('carts.cartId')}: ${cart.client_id}`);
    };

    const renderCartItem = ({ item }: { item: Cart }) => (
        <BaseCard style={styles.cartItem} onPress={() => handleCartPress(item)}>
            <View style={styles.cartHeader}>
                <BaseText variant="h6" style={styles.cartId}>
                    {t('carts.cartIdLabel')} #{item.client_id}
                </BaseText>
                <BaseText variant="caption" style={{color: getStatusColor(item.status)}}>
                    {item.status}
                </BaseText>
            </View>

            <View style={styles.cartDetails}>
                <BaseText variant="body1" style={styles.customerName}>
                    {t('carts.customer')}: {item.name || 'N/A'}
                </BaseText>
                <BaseText variant="caption" style={styles.customerCount}>
                    {t('carts.people')}: {item.customer_count}
                </BaseText>
                <BaseText variant="caption" style={styles.cashier}>
                    {t('carts.cashier')}: {item.cashier_name || 'N/A'}
                </BaseText>
            </View>

            <View style={styles.cartFooter}>
                <BaseText variant="h6" style={styles.totalPrice}>
                    {t('carts.total')}: ${item.total_price?.toFixed(2) || '0.00'}
                </BaseText>
                <BaseText variant="caption" style={styles.itemCount}>
                    {t('carts.items')}: {item.items?.length || 0}
                </BaseText>
            </View>

            {item.table && (
                <View style={styles.tableInfo}>
                    <BaseText variant="caption" style={styles.tableText}>
                        {t('carts.table')}: {item.table.name}
                    </BaseText>
                </View>
            )}
        </BaseCard>
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
                <BaseLoading size="large" />
                <BaseText variant="body1" style={styles.loadingText}>
                    {t('carts.loadingCarts')}
                </BaseText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <BaseText variant="body1" style={styles.errorText}>
                    {t('common.error')}: {error}
                </BaseText>
                <BaseButton 
                    title={t('common.retry')} 
                    onPress={handleRefresh}
                    style={styles.retryButton}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BaseText variant="h1" style={styles.title}>
                    {t('carts.restaurantOrders')}
                </BaseText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <LanguageButton />
                    <BaseButton 
                        title={t('common.refresh')} 
                        onPress={handleRefresh}
                        variant="primary"
                        size="small"
                    />
                </View>
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
                        <BaseText variant="h6" style={styles.emptyText}>
                            {t('carts.noOrdersFound')}
                        </BaseText>
                        <BaseText variant="caption" style={styles.emptySubtext}>
                            {t('carts.pullToRefresh')}
                        </BaseText>
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
