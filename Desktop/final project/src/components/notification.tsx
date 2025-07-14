'use client';

import React, { useState } from 'react';
import {
    Bell, Check, Search, Clock, MessageSquare,
    Calendar, Package, CreditCard, Shield, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type definitions
type IconComponent = React.ComponentType<{ className?: string }>;

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: IconComponent;
    color: string;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';
type FilterType = 'all' | 'unread' | 'read' | NotificationType;

const NotificationPage = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    // Initial notifications data - no localStorage
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'success',
            title: 'Payment Successful',
            message: 'Your payment of $299.99 has been processed successfully.',
            time: '2 minutes ago',
            read: false,
            icon: CreditCard,
            color: 'text-success'
        },
        {
            id: 2,
            type: 'info',
            title: 'New Message',
            message: 'Sarah Johnson sent you a message about the upcoming project meeting.',
            time: '5 minutes ago',
            read: false,
            icon: MessageSquare,
            color: 'text-info'
        },
        {
            id: 3,
            type: 'warning',
            title: 'Security Alert',
            message: 'New login detected from Chrome on Windows. Was this you?',
            time: '1 hour ago',
            read: true,
            icon: Shield,
            color: 'text-warning'
        },
        {
            id: 4,
            type: 'info',
            title: 'Calendar Reminder',
            message: 'Team standup meeting starts in 30 minutes.',
            time: '2 hours ago',
            read: false,
            icon: Calendar,
            color: 'text-info'
        },
        {
            id: 5,
            type: 'success',
            title: 'Order Delivered',
            message: 'Your order #12345 has been delivered successfully.',
            time: '3 hours ago',
            read: true,
            icon: Package,
            color: 'text-success'
        },
        {
            id: 6,
            type: 'error',
            title: 'Failed to Save',
            message: 'Your document could not be saved. Please try again.',
            time: '4 hours ago',
            read: false,
            icon: Trash2,
            color: 'text-danger'
        }
    ]);

    const [filter, setFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const markAsRead = (id: number): void => {
        setNotifications(notifications.map((notif: Notification) =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = (): void => {
        setNotifications(notifications.map((notif: Notification) => ({ ...notif, read: true })));
    };

    const deleteNotification = (id: number): void => {
        setNotifications(notifications.filter((notif: Notification) => notif.id !== id));
    };

    const filteredNotifications: Notification[] = notifications.filter((notif: Notification) => {
        const matchesFilter: boolean = filter === 'all' ||
            (filter === 'unread' && !notif.read) ||
            (filter === 'read' && notif.read) ||
            notif.type === filter;

        const matchesSearch: boolean = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notif.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const unreadCount: number = notifications.filter((notif: Notification) => !notif.read).length;
    const filterOptions: FilterType[] = ['all', 'unread', 'read', 'success', 'info', 'warning', 'error'];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterType: FilterType): void => {
        setFilter(filterType);
    };

    const loadMoreNotifications = async (): Promise<void> => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setNotifications((prev: any) => [
            ...prev,
            {
                id: prev.length + 1,
                type: 'info',
                title: 'New Notification',
                message: 'This is a newly loaded notification.',
                time: 'Just now',
                read: false,
                icon: Bell,
                color: 'text-info'
            }
        ]);

        setIsLoading(false);
    };

    const getBadgeVariant = (type: NotificationType) => {
        switch (type) {
            case 'success': return 'default';
            case 'info': return 'secondary';
            case 'warning': return 'outline';
            case 'error': return 'destructive';
            default: return 'default';
        }
    };

    const getNotificationBackground = (notification: Notification): string => {
        if (notification.read) return '';

        switch (notification.type) {
            case 'success': return 'bg-success/5 border-success/20';
            case 'info': return 'bg-info/5 border-info/20';
            case 'warning': return 'bg-warning/5 border-warning/20';
            case 'error': return 'bg-danger/5 border-danger/20';
            default: return 'bg-primary/5 border-primary/20';
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Notification Bell Button */}
            <div className="fixed top-4 right-4 z-50">
                <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="relative shadow-lg">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Bell className="h-6 w-6" />
                                        {unreadCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs animate-pulse"
                                            >
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl">Notifications</DialogTitle>
                                        <CardDescription>
                                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={markAllAsRead}
                                    disabled={unreadCount === 0}
                                    className="h-8 w-8"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </div>
                        </DialogHeader>

                        {/* Search and Filter Bar */}
                        <div className="px-6 pb-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {filterOptions.map((filterType) => (
                                    <Button
                                        key={filterType}
                                        variant={filter === filterType ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleFilterChange(filterType)}
                                        className="capitalize whitespace-nowrap"
                                    >
                                        {filterType}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <ScrollArea className="flex-1 px-6 overflow-y-auto">
                            <div className="space-y-4 pb-4">
                                {filteredNotifications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">
                                            No notifications found
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Try adjusting your search or filter criteria
                                        </p>
                                    </div>
                                ) : (
                                    filteredNotifications.map((notification) => {
                                        const IconComponent = notification.icon;
                                        return (
                                            <Card
                                                key={notification.id}
                                                className={`group transition-all duration-200 hover:shadow-md ${getNotificationBackground(notification)}`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${notification.color} bg-current/10 flex-shrink-0`}>
                                                            <IconComponent className={`h-5 w-5 ${notification.color}`} />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-semibold text-sm truncate">
                                                                        {notification.title}
                                                                    </h3>
                                                                    {!notification.read && (
                                                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{notification.time}</span>
                                                                </div>
                                                            </div>

                                                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                                                {notification.message}
                                                            </p>

                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                                                                    {notification.type}
                                                                </Badge>

                                                                {!notification.read && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        <Check className="h-3 w-3 mr-1" />
                                                                        Mark as read
                                                                    </Button>
                                                                )}

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => deleteNotification(notification.id)}
                                                                    className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        {/* Load More Button */}
                        {filteredNotifications.length > 0 && (
                            <div className="p-6 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={loadMoreNotifications}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? 'Loading...' : 'Load More Notifications'}
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default NotificationPage;