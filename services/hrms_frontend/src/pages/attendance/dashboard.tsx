import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { attendanceService, type Attendance } from '@/services/attendanceService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock } from 'lucide-react';
import { PageLayout } from '@/components/page-layout';

export default function AttendanceDashboard() {
    const [loading, setLoading] = useState(false);
    const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);
    const { toast } = useToast();

    // Mock employee ID for now - in real app this comes from auth context
    const currentEmployeeId = 1;

    const fetchTodayAttendance = async () => {
        try {
            const records = await attendanceService.getEmployeeAttendance(currentEmployeeId, 0, 1);
            const today = new Date().toISOString().split('T')[0];
            const record = records.find(r => r.date === today);
            if (record) {
                setTodayRecord(record);
            }
        } catch (error) {
            console.error('Failed to fetch attendance', error);
        }
    };

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            const record = await attendanceService.checkIn({ employee_id: currentEmployeeId });
            setTodayRecord(record);
            toast({
                title: 'Checked In',
                description: `Successfully checked in at ${new Date(record.check_in_time!).toLocaleTimeString()}`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to check in',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            const record = await attendanceService.checkOut({ employee_id: currentEmployeeId });
            setTodayRecord(record);
            toast({
                title: 'Checked Out',
                description: `Successfully checked out at ${new Date(record.check_out_time!).toLocaleTimeString()}`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to check out',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout breadcrumbs={[{ label: 'Attendance' }, { label: 'Dashboard' }]}>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h1>
                    <p className="text-muted-foreground">
                        Track your daily attendance and work hours.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Status</CardTitle>
                            <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Check In:</span>
                                </div>
                                <span className="text-sm">
                                    {todayRecord?.check_in_time
                                        ? new Date(todayRecord.check_in_time).toLocaleTimeString()
                                        : '--:--'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Check Out:</span>
                                </div>
                                <span className="text-sm">
                                    {todayRecord?.check_out_time
                                        ? new Date(todayRecord.check_out_time).toLocaleTimeString()
                                        : '--:--'}
                                </span>
                            </div>

                            <div className="pt-4 flex space-x-2">
                                {!todayRecord?.check_in_time ? (
                                    <Button
                                        className="w-full"
                                        onClick={handleCheckIn}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Check In
                                    </Button>
                                ) : !todayRecord?.check_out_time ? (
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                        onClick={handleCheckOut}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Check Out
                                    </Button>
                                ) : (
                                    <Button className="w-full" disabled variant="outline">
                                        Completed for Today
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Work Summary</CardTitle>
                            <CardDescription>This Month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-- hrs</div>
                            <p className="text-xs text-muted-foreground">
                                Total hours worked
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
}
