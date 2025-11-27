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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userService, type User } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MoreHorizontal, Shield, Ban, CheckCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/page-layout';

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data.users);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSuspend = async () => {
        if (!selectedUser) return;
        try {
            await userService.suspend(selectedUser.id, suspendReason);
            toast({
                title: 'Success',
                description: 'User suspended successfully',
            });
            setIsSuspendOpen(false);
            setSuspendReason('');
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to suspend user',
                variant: 'destructive',
            });
        }
    };

    const handleActivate = async (user: User) => {
        try {
            await userService.activate(user.id);
            toast({
                title: 'Success',
                description: 'User activated successfully',
            });
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to activate user',
                variant: 'destructive',
            });
        }
    };

    return (
        <PageLayout breadcrumbs={[{ label: 'User Management' }]}>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage system users, roles, and access.
                    </p>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {user.first_name} {user.last_name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-muted-foreground" />
                                                <span className="capitalize">{user.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : user.status === 'suspended'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                        Copy Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status === 'active' ? (
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsSuspendOpen(true);
                                                            }}
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" /> Suspend User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-green-600"
                                                            onClick={() => handleActivate(user)}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Activate User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Suspend User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to suspend this user? They will not be able to log in.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Reason for suspension</Label>
                                <Input
                                    id="reason"
                                    value={suspendReason}
                                    onChange={(e) => setSuspendReason(e.target.value)}
                                    placeholder="e.g., Security violation"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleSuspend}>
                                Suspend
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLayout>
    );
}
