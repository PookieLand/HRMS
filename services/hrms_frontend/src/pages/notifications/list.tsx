import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { notificationService, type Notification } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bell, RefreshCw } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PageLayout } from '@/components/page-layout';

export default function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { toast } = useToast();

    // Mock employee ID
    const currentEmployeeId = 1;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getEmployeeNotifications(currentEmployeeId);
            setNotifications(data.items);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch notifications',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleRetry = async (notificationId: number) => {
        try {
            await notificationService.retry(notificationId);
            toast({
                title: 'Success',
                description: 'Notification retry initiated',
            });
            fetchNotifications();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to retry notification',
                variant: 'destructive',
            });
        }
    };

    const filteredNotifications = statusFilter === 'all'
        ? notifications
        : notifications.filter(n => n.status === statusFilter);

    return (
        <PageLayout breadcrumbs={[{ label: 'Notifications' }]}>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">
                            View and manage system notifications.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="SENT">Sent</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredNotifications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Bell className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">No notifications found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>Email</TableCell>
                                        <TableCell>{notification.recipient_email}</TableCell>
                                        <TableCell className="max-w-xs truncate">{notification.subject}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${notification.status === 'SENT'
                                                ? 'bg-green-100 text-green-800'
                                                : notification.status === 'FAILED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {notification.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {notification.sent_at
                                                ? new Date(notification.sent_at).toLocaleString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {notification.status === 'FAILED' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRetry(notification.id)}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </PageLayout>
    );
}
