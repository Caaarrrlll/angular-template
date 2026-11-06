import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { _CountryCode } from "@models/country-code.enum";
import { Navigation } from "@models/navigation";
import { LoginService } from "@services/login.service";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class NavigationService {
	public reportNavigation: Navigation[];
	public menuNavigation: Navigation[];
	keepChildren = new BehaviorSubject(null);

	constructor(private loginService: LoginService) {
		this.setupMenu();
	}

	setupMenu() {
		let tempMenuParent = new Navigation({
			name: "menu nav",
			allowedCountries: [_CountryCode.ZA],
			children: JSON.parse(JSON.stringify(allMenuItems)),
		});

		let tempReportsParent = new Navigation({
			name: "report nav",
			allowedCountries: [_CountryCode.ZA],
			children: JSON.parse(JSON.stringify(allReports)),
		});

		this.reportNavigation = this.navSetup(tempReportsParent)?.children;

		this.reportClaims(tempReportsParent.claims, tempMenuParent.children);
		this.menuNavigation = this.navSetup(tempMenuParent)?.children;
	}

	reportClaims(reportClaims, menuItems: Navigation[]) {
		let index = menuItems.findIndex((item) => item.name == "Reports");
		if (index != -1) {
			menuItems[index].claims = reportClaims;
		}
	}

	navSetup(nav: Navigation) {
		nav.children.map((child) => {
			this.navSetup(child);
			nav.claims = this.returnDistinctClaimsList(nav.claims, child.claims);
			nav.allowedCountries = this.returnDistinctAllowedCountriesList(nav.allowedCountries, child.allowedCountries);
		});
		nav.children = nav.children?.filter((child) => this.canDisplay(child));
		return nav;
	}

	returnDistinctClaimsList(parentClaims: string[], childClaims: string[]) {
		childClaims?.map((childClaim) => {
			if (parentClaims?.indexOf(childClaim) === -1) {
				parentClaims.push(childClaim);
			}
		});
		return parentClaims;
	}

	returnDistinctAllowedCountriesList(parentCountries: _CountryCode[], childCountries: _CountryCode[]) {
		childCountries?.map((childCountry) => {
			if (parentCountries?.indexOf(childCountry) === -1) {
				parentCountries.push(childCountry);
			}
		});
		return parentCountries;
	}

	canDisplay(navigation: Navigation): boolean {
		const hasRequiredClaims: boolean = this.loginService.currentUserValue && navigation.claims ? this.loginService.userHasRequiredClaims(navigation.claims) : false;
		const countryCodeIncluded: boolean = navigation.allowedCountries.includes(environment.countryCode);
		return hasRequiredClaims && countryCodeIncluded;
	}

	keepChildrenSet(children: Navigation[]) {
		this.keepChildren.next(children);
	}

	keepChildrenGet() {
		return this.keepChildren;
	}

	getMenuMain(): Navigation[] {
		return this.menuNavigation;
	}
}

//icons at https://fonts.google.com/icons
const allMenuItems: Navigation[] = [
	new Navigation({
		name: "Buying",
		icon: "trolley.svg",
		children: [
			new Navigation({
				name: "Overview",
				path: "/buyers/overview",
				claims: ["ims_overview"],
				allowedCountries: [_CountryCode.ZA],
				dontShowOnSideMenu: true,
			}),
			new Navigation({
				name: "Targets",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Overview",
						path: "targets/buying/overview",
						claims: ["bts_admin", "bts_can_view"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Configuration",
						path: "targets/configuration/buying",
						claims: ["bts_admin", "bts_can_configure"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
			new Navigation({
				name: "BLMS",
				children: [
					new Navigation({
						name: "My Leads",
						path: "blms/my-leads",
						children: [],
						claims: ["blms_admin", "blms_get_my_leads", "tat_super_user", "tat_approve"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Leads List",
						path: "blms/leads",
						claims: ["blms_admin", "blms_get_all_leads"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Capture Lead",
						path: "blms/new-lead",
						claims: ["blms_create_lead"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Opportunity Leads",
						path: "blms/opportunity-leads",
						claims: ["blms_get_all_partial_leads", "blms_claim_partial_lead"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Quality Control",
						path: "blms/quality-control",
						claims: ["blms_admin", "blms_quality_control"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Pending and Walkaways",
						path: "blms/pending-and-walkaways",
						claims: ["Int_NervCenter"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Specialisation Groups",
						path: "blms/specialisation-groups",
						claims: ["blms_specialisation_groups"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),

			new Navigation({
				name: "Buyer Manager",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Quality Service",
						path: "blms/quality-service",
						claims: ["blms_quality_service"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Appointment Dashboard",
						path: "blms/appointment-dashboard",
						claims: ["blms_appointment_dashboard"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Bad Buy Approval",
						path: "/pricing/bad-buy-approval",
						claims: ["Pricing_Bad_Buy", "Pricing_Bad_Buy_Admin"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Buyer Filters",
						path: "blms/buyer-filters",
						claims: ["blms_quality_service"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Stock Commission",
						path: "/buyers",
						claims: ["ims_overview"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Rankings",
						path: "/buyers/ranking",
						claims: ["blms_get_all_leads", "blms_get_my_leads"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Buyer Sign In",
						path: "blms/buyer-sign-in",
						claims: ["user_management_admin"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
			new Navigation({
				name: "Configuration",
				children: [
					new Navigation({
						name: "Channel Costs",
						path: "blms/configuration",
						claims: ["blms_admin", "blms_channel_costs"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
				dontShowOnSideMenu: true,
			}),
			new Navigation({
				name: "Payments",
				icon: "", //finance.svg
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Overview",
						path: "/finance/overview",
						claims: ["Int_Reporting_Gp"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Account Verification",
						path: "/finance/account-verification",
						claims: ["finance_account_verification", "fin_read"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "My Payments",
						path: "/finance/payments",
						claims: ["fin_outstanding_payments"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "Attendance",
				icon: "calendar.svg",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Overview",
						path: "/attendance/overview",
						claims: ["tat_approve", "tat_super_user"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Summary",
						path: "/attendance/summary",
						claims: ["tat_approve", "tat_super_user"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Sign-Off",
						path: "/attendance/sign-off",
						claims: ["tat_approve", "tat_super_user", "tat_overview_payroll"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "User Management",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "User List",
						path: "user-management/user-list",
						claims: ["user_management_admin"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Weight Distribution",
						path: "user-management/weight-distribution",
						claims: ["user_management_blms_weights", "blms_weight_distribution_read"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Buyer Statistics",
						path: "user-management/buyer-statistics",
						claims: ["user_management_admin"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "User Statistics",
						path: "blms/queue-length",
						claims: ["blms_user_statistics"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					//TODO Add User Statistics
					// new Navigation({
					// 	name: "User Statistics",
					// 	path: "user-management/user-statistics",
					// 	claims: ["user_management_admin"],
					// }),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Selling",
		icon: "storefront.svg",
		children: [
			new Navigation({
				name: "Print Price Cards",
				path: "/selling/price-cards",
				claims: ["Int_Printing"],
				allowedCountries: [_CountryCode.ZA],
				dontShowOnSideMenu: true,
			}),
			new Navigation({
				name: "Online Payments",
				path: "/selling/online-payments",
				claims: ["Auction_User", "Auction_Manager"],
				allowedCountries: [_CountryCode.ZA],
				dontShowOnSideMenu: true,
			}),
			new Navigation({
				name: "Targets",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Overview",
						path: "targets/selling/overview",
						claims: ["sts_admin", "sts_can_view"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Configuration",
						path: "targets/configuration/selling",
						claims: ["sts_admin", "sts_can_configure"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Setup",
						path: "targets/selling/setup",
						claims: ["sts_admin", "sts_can_configure"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Leader Board",
						path: "targets/selling/leader-board",
						claims: ["sts_can_view_leaderboard"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
			new Navigation({
				name: "SLMS",
				children: [
					new Navigation({
						name: "Overview",
						path: "/slms",
						claims: ["lead_management_admin", "lead_management_reports"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Leads",
						path: "/slms/leads",
						claims: [
							"lead_management_admin",
							"lead_management_assign",
							"lead_management_get_my_leads",
							"lead_management_get_branch_leads",
							"lead_management_get_all_leads",
						],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Sales Cancellations",
						path: "/slms/cancellation-task-list",
						claims: ["slms_cancellations_admin", "slms_cancellations_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Opportunity Leads",
						path: "/slms/opportunity-leads",
						claims: ["lead_management_admin", "lead_management_call_center_lead", "lead_management_call_center_agent"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Sales Administration",
						path: "/slms/sales-administration",
						claims: ["lead_management_admin", "lead_management_can_see_sales_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Sales Archive",
						path: "/slms/sales-archive",
						claims: ["lead_management_admin", "lead_management_sales_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Discounts",
						path: "/slms/discounts",
						claims: ["lead_management_approve_discount", "lead_management_view_discount"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Online Finance Applications",
						path: "/slms/online-finance-applications",
						claims: ["lead_management_finance_start_sale"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Capitec Purpose Loan",
						path: "/slms/capitec-purpose-loan",
						claims: ["finapp_capitec_outcome"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "Auctions",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "Online Auctions",
						path: "/auctions",
						claims: ["Auction_Manager", "Auction_Online_View"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Live Auctions",
						path: "/auctions/live-auctions",
						claims: ["Auction_Manager", "Auction_Live_Viewer"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Bulk Auction Create",
						path: "/auctions/bulk-create",
						claims: ["Auction_Manager", "Auction_Bulk_Create"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Online Auctions Sales Report",
						path: "/reports/online-auction-sales",
						claims: ["Auction_Sales_Report", "Auction_Manager"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Online Auctions Sales Not Invoiced",
						path: "/reports/online-auction-sales-not-invoiced",
						claims: ["Auction_Sales_Not_Invoiced", "Auction_Manager"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Online Auctions Bid History Report",
						path: "/reports/stock-item-auction-history",
						claims: ["Auction_Bid_History"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
					new Navigation({
						name: "Online Auctions Outcomes Report",
						path: "/reports/online-auction-outcomes",
						claims: ["Auction_Outcome_Report", "Auction_Manager"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
			new Navigation({
				name: "User Management",
				dontShowOnSideMenu: true,
				children: [
					new Navigation({
						name: "User List",
						path: "selling/user-management/user-list",
						claims: ["slms_user_management_super_admin", "slms_user_management_read", "slms_user_management_administration"],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
			new Navigation({
				name: "VAPS",
				dontShowOnSideMenu: true,
				allowedCountries: [_CountryCode.ZA],
				children: [
					new Navigation({
						name: "Product Guidebook",
						path: "vaps/product-guidebook",
						claims: [
							"lead_management_admin",
							"lead_management_assign",
							"lead_management_get_my_leads",
							"lead_management_get_branch_leads",
							"lead_management_get_all_leads",
						],
						allowedCountries: [_CountryCode.ZA],
						dontShowOnSideMenu: true,
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Pricing",
		icon: "account_balance_wallet.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Stock",
				path: "/pricing/stock",
				claims: ["Int_Price_Recommenders", "Int_Price_Publishers", "Int_Price_Approvers", "pricing_view"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Price Review",
				path: "/price-review",
				claims: ["Pricing_Price_Reviews"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Stock Health",
				path: "/price-review/stock-health-check",
				claims: ["Int_Price_Recommenders", "pricing_view"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Price Review Reasons",
				path: "/price-review/reasons-edit",
				claims: ["Pricing_Price_Review_Management"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Pricing User Management",
				path: "/pricing/user-management",
				claims: ["Pricing_User_Management"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Potential Price Drop Omissions",
				path: "/pricing/potential-price-drop-omissions",
				claims: ["pricing_view"],
				allowedCountries: [_CountryCode.ZA],
				dontShowOnSideMenu: true,
			}),
			new Navigation({
				name: "Pricing Config",
				children: [
					new Navigation({
						name: "Price Adjustments",
						path: "/pricing-config/price-adjustment",
						claims: ["Pricing_Config"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Price Drop Criteria",
						path: "/pricing-config/price-drop-criteria",
						claims: ["Pricing_Config"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: " Price Drop Auction Adjustments",
						path: "/pricing-config/price-drop-auction-config",
						claims: ["Pricing_Config"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Price Drop Adjustments",
						path: "/pricing-config/price-drop-adjustment",
						claims: ["Pricing_Config"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Price Drop Ranges",
						path: "/pricing-config/price-drop-price-ranges",
						claims: ["xxx"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Inventory",
		icon: "inventory.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Stock",
				path: "/stock",
				claims: ["ims_stock", "ims_stock_overview"],
				allowedCountries: [_CountryCode.ZA],
			}),

			new Navigation({
				name: "Active Stock",
				path: "/stock/active",
				claims: ["ims_stock", "ims_stock_overview"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Stock Issues",
				path: "/stock/stock-issues",
				claims: ["ims_stock", "ims_stock_overview"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Reports",
				children: [
					new Navigation({
						name: "Dekra",
						path: "/operations/dekra-list",
						claims: ["ims_overview", "ims_dekra_report"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Stock Operations",
						path: "/operations",
						claims: ["ims_stock", "senior_dealer_operations"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Consignment",
						path: "/operations/consignment-stock",
						claims: ["ims_overview"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Stock Not in Evolve",
						path: "/stock/stock-not-in-evolve",
						claims: ["ims_stock_not_in_evolve"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Stock Compliance",
						path: "/operations/compliance",
						claims: ["ims_stock"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Stock Monitoring",
						path: "/stock/stock-monitoring",
						claims: ["ims_stock", "ims_stock_not_in_evolve"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Website Exceptions",
						path: "/reports/website-exceptions",
						claims: ["Int_Reporting_Website"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Photobooth Images",
						path: "/stock/photobooth-images",
						claims: ["ims_overview"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "Operations",
				children: [
					new Navigation({
						name: "Stock Take",
						path: "/stock/stock-take",
						claims: ["ims_process_create_stock_take", "ims_stock_take_exception"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "My Gate Passes",
						path: "/stock/my-gate-passes",
						claims: ["ims_gate_pass_my_gate_passes"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Bulk Branch Transfers",
						path: "/stock/branch-transfer",
						claims: ["ims_stock", "ims_stock_not_in_evolve"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "User Management",
				children: [
					new Navigation({
						name: "User List",
						path: "/stock/ims-user-management/user-list",
						claims: ["user_management_ims_administration"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "Recon",
				children: [
					new Navigation({
						name: "Overview",
						path: "/stock/recon-and-repairs/overview",
						claims: ["ims_stock"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Recon and Repairs",
						path: "/stock/recon-and-repairs/stock-items",
						claims: ["ims_stock"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Logistics",
		icon: "logistics-mat.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Overview",
				path: "/logistics/dashboard",
				claims: ["logistics_super_user", "logistics_team_leader", "logistics_national_manager", "logistics_regional_manager", "logistics_buyer", "logistics_management"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Month End Reports",
				path: "/logistics/month-end-reports",
				claims: ["logistics_super_user", "logistics_national_manager", "logistics_regional_manager", "logistics_management"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Collections Schedule View",
				path: "/logistics/collection-schedule-day",
				claims: ["logistics_super_user", "logistics_team_leader", "logistics_national_manager", "logistics_regional_manager", "logistics_buyer"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Outstanding Collections",
				path: "/logistics/collection-outstanding-dashboard",
				claims: ["logistics_super_user", "logistics_national_manager", "logistics_regional_manager", "logistics_management"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Collections",
				path: "/logistics/collections",
				claims: ["logistics_super_user", "logistics_team_leader", "logistics_national_manager", "logistics_regional_manager", "logistics_buyer"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Configuration",
				path: "/logistics/configuration",
				claims: ["logistics_super_user"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Fleet",
				icon: "car.svg",
				children: [
					new Navigation({
						name: "Drivers",
						path: "/fleet-management/drivers",
						claims: ["fleet_management_admin", "create_driver", "driver_assignment_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Fuel",
						path: "/fleet-management/fuel",
						claims: ["fleet_management_admin", "vehicle_expense_management_admin", "capture_fuel", "capture_fuel_other"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "Logistics Management",
				children: [
					new Navigation({
						name: "User List",
						path: "/logistics/user-management",
						claims: ["logistics_super_user", "logistics_team_leader", "logistics_national_manager", "logistics_regional_manager", "logistics_buyer"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Employee Management",
						path: "/logistics/logistics-employees",
						claims: ["logistics_super_user", "logistics_national_manager", "logistics_regional_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Team Management",
						path: "/logistics/collection-teams",
						claims: ["logistics_super_user", "logistics_team_leader", "logistics_national_manager", "logistics_regional_manager", "logistics_buyer"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "Driver Tracking",
				icon: "management.svg",
				children: [
					new Navigation({
						name: "Track Events",
						path: "/driver-tracking",
						icon: "recon-mat.svg",
						claims: ["tracking_admin", "tracking_read"],
						allowedCountries: [_CountryCode.ZA],
						weight: "normal",
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "Attendance",
				children: [
					new Navigation({
						name: "Approval Requests",
						path: "/logistics/approval-requests",
						claims: ["tat_super_user", "tat_logistics_approve"],
						allowedCountries: [_CountryCode.ZA],
						weight: "normal",
					}),
				],
				weight: "normal",
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "NaTIS",
		icon: "library_books.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Overview",
				path: "/natis/natis-dashboard",
				claims: ["natis_admin", "natis_dashboard"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Vehicle List",
				path: "/natis/vehicle-list",
				claims: ["natis_admin", "natis_request_dealerstock", "natis_read", "natis_create"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "NaTIS Document List",
				path: "/natis/list",
				claims: ["natis_admin", "natis_manual_capture", "natis_read", "natis_create", "natis_update"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Move NaTIS Documents",
				path: "/natis/move",
				claims: ["natis_admin", "natis_waybill"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Receive NaTIS Documents",
				path: "/natis/receive",
				claims: ["natis_admin", "natis_waybill", "natis_create", "natis_update"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Sign-out NaTIS Documents",
				path: "/natis/signout",
				claims: ["natis_admin", "natis_signout"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Waybills",
				path: "/natis/waybills",
				claims: ["natis_admin", "natis_waybill"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Service Providers",
				children: [
					new Navigation({
						name: "Online Company Tasks",
						path: "/natis/online-company/tasks",
						claims: ["natis_admin", "natis_online_company_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Car Licence Tasks",
						path: "/natis/car-licence/tasks",
						claims: ["natis_admin", "natis_car_licence_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Wilma Q4U Tasks",
						path: "/natis/wilmaq4u/tasks",
						claims: ["natis_admin", "natis_wilmaq4u_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Coastal Tasks",
						path: "/natis/coastal/tasks",
						claims: ["natis_admin", "natis_coastal_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					// new Navigation({
					// 	name: "Radical Worx Tasks",
					// 	path: "/natis/radical-worx/tasks",
					// 	claims: ["natis_admin", "natis_radical_worx_manager"],
					// 	allowedCountries: [_CountryCode.ZA],
					// }),
					// new Navigation({
					// 	name: "Fast Reg Tasks",
					// 	path: "/natis/fast-reg/tasks",
					// 	claims: ["natis_admin", "natis_fast_reg_manager"],
					// 	allowedCountries: [_CountryCode.ZA],
					// }),
					new Navigation({
						name: "Zaanfer Hewitt Tasks",
						path: "/natis/hewitt/tasks",
						claims: ["natis_admin", "natis_hewitt_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Reg Co Tasks",
						path: "/natis/regco/tasks",
						claims: ["natis_admin", "natis_regco_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "WeBuyCars In-House Tasks",
						path: "/natis/inhouse/tasks",
						claims: ["natis_admin", "natis_wbc_inhouse_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "WeBuyCars Online Tasks",
						path: "/natis/online/tasks",
						claims: ["natis_admin", "natis_wbc_online_manager"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
			new Navigation({
				name: "Configuration",
				children: [
					new Navigation({
						name: "Suppliers",
						path: "/natis/suppliers",
						claims: ["natis_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "CRM",
		icon: "crm-mat.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Customers",
				path: "/customer",
				claims: ["Int_CRM"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Concerns",
				allowedCountries: [_CountryCode.ZA],
				children: [
					new Navigation({
						name: "Inbox",
						path: "/concerns/inbox",
						claims: ["CMT_Admin", "CMT_Agents", "CMT_Read_Only"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Management",
		icon: "management.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Recons",
				path: "/recon",
				icon: "recon-mat.svg",
				claims: ["Int_Recon"],
				allowedCountries: [_CountryCode.ZA],
				weight: "normal",
			}),
			new Navigation({
				name: "Reports",
				path: "/reports",
				icon: "",
				claims: ["Int_Recon"],
				allowedCountries: [_CountryCode.ZA],
				weight: "normal",
			}),
			new Navigation({
				name: "Stock Alerts",
				path: "/selling",
				claims: ["Int_Snapshot_Value"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "Config",
		icon: "settings.svg",
		dontShowOnSideMenu: true,
		children: [
			new Navigation({
				name: "Finance Calculator",
				path: "/finance-calculator",
				claims: ["fin_financial_constant_admin"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Auction Templates",
				path: "/auctions/auction-template",
				claims: ["Auction_Manager"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "API Documentation",
				path: "/settings/api-documentation",
				claims: ["Int_Admin", "settings_admin"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Catalogue",
				icon: "web.svg",
				path: "/catalogue/overview",
				claims: ["cat_admin"],
				allowedCountries: [_CountryCode.ZA],
				weight: "normal",
			}),
			new Navigation({
				name: "Configurations",
				icon: "",
				children: [
					new Navigation({
						name: "Locations",
						path: "/settings/locations",
						claims: ["Int_Admin", "settings_admin", "org_pin_maintain", "org_depot_maintain", "org_workshop_maintain"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Global Settings",
						path: "/global-settings",
						claims: ["Int_Admin", "settings_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Bank Accounts",
						path: "/banking",
						claims: ["banking_admin", "banking_read"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Build Management",
						path: "/settings/build-management",
						claims: ["Int_Admin", "settings_admin", "mobile_buildmanagement_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "RTMC",
						path: "/settings/rtmc",
						claims: ["rtmc_settings_admin_read", "rtmc_settings_admin_create", "rtmc_settings_admin_delete"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "We-Support",
				icon: "manage_accounts.svg",
				children: [
					new Navigation({
						name: "Tickets",
						path: "/we-support/tickets",
						claims: ["we_support_staff", "we_support_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Ticket Admin",
						path: "/we-support/admin",
						claims: ["we_support_staff", "we_support_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Broadcast",
						path: "/we-support/admin/broadcast",
						claims: ["we_support_staff", "we_support_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Requests",
						path: "/we-support/requests/board",
						claims: ["we_request_superuser", "we_request_admin"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Overview",
						path: "/we-support/overview",
						claims: ["we_request_superuser"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Request Admin",
						children: [
							new Navigation({
								name: "Create",
								path: "/we-support/requests/admin/create",
								claims: ["we_request_superuser"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Sponsors",
								path: "/we-support/requests/admin/sponsors",
								claims: ["we_request_superuser"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Owners",
								path: "/we-support/requests/admin/owners",
								claims: ["we_request_superuser"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Products",
								path: "/we-support/requests/admin/products",
								claims: ["we_request_superuser"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "It Users",
								path: "/we-support/requests/admin/users",
								claims: ["we_request_superuser"],
								allowedCountries: [_CountryCode.ZA],
							}),
						],
					}),
				],
				weight: "normal",
			}),
			new Navigation({
				name: "Process Engine",
				icon: "multiple_stop.svg",
				claims: ["pe_admin", "pe_read"],
				children: [
					new Navigation({
						name: "Domain Configuration",
						claims: ["pe_admin", "pe_read"],
						path: "/process-engine/domain-config",
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Process Definition",
						claims: ["pe_admin", "pe_read"],
						path: "/process-engine/process-definition/list",
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Setup",
						children: [
							new Navigation({
								name: "Domain",
								path: "/process-engine/domain",
								claims: ["pe_admin", "pe_read"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Entry Criteria",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/entry-criteria",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Executor",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/executor",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Condition",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/condition",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Data Updater",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/data-updater",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Lookup",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/lookup",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "External Services",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine/external-service",
								allowedCountries: [_CountryCode.ZA],
							}),
						],
					}),
				],
			}),
			new Navigation({
				name: "Process Engine V2",
				icon: "multiple_stop.svg",
				claims: ["pe_admin", "pe_read"],
				children: [
					new Navigation({
						name: "Domain Configuration",
						claims: ["pe_admin", "pe_read"],
						path: "/process-engine-v2/domain-configuration",
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Process Definitions",
						claims: ["pe_admin", "pe_read"],
						path: "/process-engine-v2",
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Setup",
						children: [
							new Navigation({
								name: "Condition",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/condition",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Data Updater",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/data-updater",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Domain",
								path: "/process-engine-v2/setup/domain",
								claims: ["pe_admin", "pe_read"],
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Entry Criteria",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/entry-criteria",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Executor",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/executor",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "External Services",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/external-services",
								allowedCountries: [_CountryCode.ZA],
							}),
							new Navigation({
								name: "Lookup",
								claims: ["pe_admin", "pe_read"],
								path: "/process-engine-v2/setup/lookup",
								allowedCountries: [_CountryCode.ZA],
							}),
						],
					}),
				],
			}),
			new Navigation({
				name: "Stock Configuration",
				children: [
					new Navigation({
						name: "Stock Flag Management",
						path: "/settings/stock-configuration",
						claims: ["pe_admin", "pe_read"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Flags",
						path: "/settings/flag-configuration",
						claims: ["pe_admin", "pe_read"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Tags",
						path: "/settings/tag-configuration",
						claims: ["pe_admin", "pe_read"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
		weight: "normal",
	}),
	new Navigation({
		name: "RTMC",
		icon: "warehouse.svg",
		dontShowOnSideMenu: true,
		claims: ["pe_admin", "pe_read"],
		children: [
			new Navigation({
				name: "Admin",
				path: "/settings/rtmc",
				claims: ["rtmc_settings_admin_read", "rtmc_settings_admin_create", "rtmc_settings_admin_delete"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Suspicious ID",
				path: "blms/suspicious-leads",
				claims: ["natis_suspicions"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Vehicle Check",
				path: "/buyers/vin-check",
				claims: ["rtmc_getvehicle"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Driver Check",
				path: "/buyers/driver-check",
				claims: ["rtmc_getdriver"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Fee Calculator",
				path: "/buyers/fee-calculator",
				claims: ["rtmc_vehiclefeecalculate"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Vehicle Owner",
				children: [
					new Navigation({
						name: "Owner Verification",
						path: "/buyers/vehicle-owner-check",
						claims: ["rtmc_vehicleownerverification"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Ownership History",
						path: "/buyers/vehicle-owner-history-check",
						claims: ["rtmc_ownership_verification"],
						allowedCountries: [_CountryCode.ZA],
					}),
					new Navigation({
						name: "Control Number Verification",
						path: "/buyers/control-number-verification",
						claims: ["rtmc_vehicleownerverification"],
						allowedCountries: [_CountryCode.ZA],
					}),
				],
			}),
		],
	}),
];

const allReports: Navigation[] = [
	new Navigation({
		name: "Stock Operations",
		children: [
			new Navigation({
				name: "Historic Sales / Bought Trend",
				path: "recon",
				claims: ["Int_Recon"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
	}),
	new Navigation({
		name: "Financial Reports",
		children: [
			new Navigation({
				name: "Bank Balance Trend Report",
				path: "bank-balance",
				claims: ["Int_Reporting_Current_Debtors"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Current Debtors Report",
				path: "debtors",
				claims: ["Int_Reporting_Debtors_Trend"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Debtors Trend Report",
				path: "debtors",
				claims: ["Int_Reporting_Debtors_Trend"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Unallocated Transactions Report",
				path: "unallocated-transactions",
				claims: ["Int_Reporting_Current_Debtors", "Int_Unallocated_Report_Read"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Gp Report",
				path: "gp",
				claims: ["Int_Reporting_Gp"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Financial Analysis",
				path: "gp-graphs",
				claims: ["Int_Reporting_Gp"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
	}),
	new Navigation({
		name: "Exception Reports",
		children: [
			new Navigation({
				name: "Website Report",
				path: "website-exceptions",
				claims: ["Int_Reporting_Website"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
	}),
	new Navigation({
		name: "Fleet Management Reports",
		children: [
			new Navigation({
				name: "Fuel Expense Summary Report",
				path: "fuel-expense-report",
				claims: ["vehicle_expense_management_admin"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Fuel Expense Detail Report",
				path: "fuel-expense-detail-report",
				claims: ["vehicle_expense_management_admin"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
	}),
	new Navigation({
		name: "Online Auctions",
		children: [
			new Navigation({
				name: "Online Auctions Sales Report",
				path: "online-auction-sales",
				claims: ["Int_Online_Auctions", "Int_Online_Auctions_Managers"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Online Auctions Outcomes Report",
				path: "online-auction-outcomes",
				claims: ["Int_Online_Auctions_Managers"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Online Auctions Sales Report",
				path: "/reports/online-auction-sales",
				claims: ["Int_Online_Auctions", "Int_Online_Auctions_Managers"],
				allowedCountries: [_CountryCode.ZA],
			}),
			new Navigation({
				name: "Online Auctions Bid History Report",
				path: "stock-item-auction-history",
				claims: ["Auction_Bid_History"],
				allowedCountries: [_CountryCode.ZA],
			}),
		],
	}),
];
