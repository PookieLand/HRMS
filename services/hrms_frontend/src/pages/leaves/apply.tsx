import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { leaveService, type Leave } from '@/services/leaveService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PageLayout } from '@/components/page-layout';

export default function LeaveApply() {
    const [loading, setLoading] = useState(false);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const { toast } = useToast();

    // Mock employee ID
    const currentEmployeeId = 1;

    const [formData, setFormData] = useState({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const fetchLeaves = async () => {
        try {
            const data = await leaveService.getEmployeeLeaves(currentEmployeeId);
            setLeaves(data);
        } catch (error) {
            console.error('Failed to fetch leaves', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await leaveService.create({
                employee_id: currentEmployeeId,
                ...formData,
            });
            toast({
                title: 'Success',
                description: 'Leave request submitted successfully',
            });
            setFormData({
                leave_type: 'annual',
                start_date: '',
                end_date: '',
                reason: '',
            });
            fetchLeaves();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to submit leave request',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout breadcrumbs={[{ label: 'Leave Management' }, { label: 'Apply' }]}>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground">
                        Apply for leave and track your requests.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Apply for Leave</CardTitle>
                            <CardDescription>Submit a new leave request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="leave_type">Leave Type</Label>
                                    <Select
                                        value={formData.leave_type}
                                        onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select leave type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="annual">Annual Leave</SelectItem>
                                            <SelectItem value="sick">Sick Leave</SelectItem>
                                            <SelectItem value="casual">Casual Leave</SelectItem>
                                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                                            <SelectItem value="paternity">Paternity Leave</SelectItem>
                                            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reason">Reason</Label>
                                    <Textarea
                                        id="reason"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="Please provide a reason for your leave..."
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Submit Request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Leave History</CardTitle>
                            <CardDescription>Recent leave requests and their status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaves.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24">
                                                    No leave history found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            leaves.slice(0, 5).map((leave) => (
                                                <TableRow key={leave.id}>
                                                    <TableCell className="capitalize">{leave.leave_type}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {new Date(leave.start_date).toLocaleDateString()} -{' '}
                                                        {new Date(leave.end_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${leave.status === 'APPROVED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : leave.status === 'REJECTED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {leave.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
}
